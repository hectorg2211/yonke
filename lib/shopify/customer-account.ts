import "server-only";

import { cache } from "react";
import { formatMoney, type Money } from "@/lib/shopify/money";
import { discoverCustomerApi } from "@/lib/shopify/customer-discovery";
import { getCustomerAccessToken } from "@/lib/shopify/customer-session";
import { getCustomerAccountEnv } from "@/lib/shopify/env";

export type CustomerOrder = {
  id: string;
  name: string;
  processedAt: string;
  financialStatus: string | null;
  fulfillmentStatus: string | null;
  total: string;
  statusPageUrl: string | null;
};

export type CustomerAccount = {
  id: string;
  displayName: string;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  addressLines: string[];
  orders: CustomerOrder[];
};

const CUSTOMER_QUERY = /* GraphQL */ `
  query CustomerAccount {
    customer {
      id
      displayName
      firstName
      lastName
      emailAddress {
        emailAddress
      }
      defaultAddress {
        formatted
        formattedArea
      }
      orders(first: 20, reverse: true, sortKey: PROCESSED_AT) {
        nodes {
          id
          name
          processedAt
          financialStatus
          fulfillmentStatus
          statusPageUrl
          totalPrice {
            amount
            currencyCode
          }
        }
      }
    }
  }
`;

type CustomerQueryData = {
  customer: {
    id: string;
    displayName: string;
    firstName: string | null;
    lastName: string | null;
    emailAddress: { emailAddress: string } | null;
    defaultAddress: {
      formatted: string[] | null;
      formattedArea: string | null;
    } | null;
    orders: {
      nodes: {
        id: string;
        name: string;
        processedAt: string;
        financialStatus: string | null;
        fulfillmentStatus: string | null;
        statusPageUrl: string | null;
        totalPrice: Money;
      }[];
    };
  } | null;
};

type GraphqlResult<T> = {
  data?: T;
  errors?: { message: string }[];
};

async function customerFetch<T>(
  query: string,
  accessToken: string,
): Promise<T> {
  const env = getCustomerAccountEnv();
  if (!env.ok) {
    throw new Error("Customer Account API no está configurada.");
  }

  const api = await discoverCustomerApi(env.config.domain);
  const response = await fetch(api.graphql_api, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: accessToken,
    },
    body: JSON.stringify({ query }),
    cache: "no-store",
    signal: AbortSignal.timeout(8_000),
  });

  const payload = (await response.json()) as GraphqlResult<T>;
  if (payload.errors?.length) {
    throw new Error(payload.errors.map((error) => error.message).join("; "));
  }
  if (!response.ok || !payload.data) {
    throw new Error(`Customer Account API ${response.status}`);
  }

  return payload.data;
}

export const getCustomerAccount = cache(
  async (): Promise<CustomerAccount | null> => {
    const accessToken = await getCustomerAccessToken();
    if (!accessToken) return null;

    const data = await customerFetch<CustomerQueryData>(CUSTOMER_QUERY, accessToken);
    const customer = data.customer;
    if (!customer) return null;

    const addressLines =
      customer.defaultAddress?.formatted?.filter(Boolean) ??
      (customer.defaultAddress?.formattedArea
        ? [customer.defaultAddress.formattedArea]
        : []);

    return {
      id: customer.id,
      displayName: customer.displayName,
      firstName: customer.firstName,
      lastName: customer.lastName,
      email: customer.emailAddress?.emailAddress ?? null,
      addressLines,
      orders: customer.orders.nodes.map((order) => ({
        id: order.id,
        name: order.name,
        processedAt: order.processedAt,
        financialStatus: order.financialStatus,
        fulfillmentStatus: order.fulfillmentStatus,
        total: formatMoney(order.totalPrice),
        statusPageUrl: order.statusPageUrl,
      })),
    };
  },
);
