

interface GraphQLResponse<T> {
    data: T;
  }
  
  export async function fetchGraphQL<T>(query: string, variables: Record<string, unknown> = {}): Promise<T> {
  
  
    const response = await fetch('http://localhost:8000/graphql/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query, variables }),
    });
    const { data }: GraphQLResponse<T> = await response.json();
    return data;
  }