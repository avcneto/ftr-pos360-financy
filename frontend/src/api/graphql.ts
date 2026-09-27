export async function requestGraphQL<T>(
  query: string,
  variables: Record<string, unknown> = {},
  token?: string | null,
): Promise<T> {
  const response = await fetch(
    import.meta.env.VITE_BACKEND_URL ?? "http://localhost:4000/graphql",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ query, variables }),
    },
  );

  const payload = await response.json();

  if (!response.ok || payload.errors) {
    throw new Error(payload.errors?.[0]?.message ?? "Não foi possível concluir a solicitação.");
  }

  return payload.data as T;
}
