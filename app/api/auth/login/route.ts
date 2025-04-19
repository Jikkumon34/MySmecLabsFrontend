import { NextResponse } from 'next/server';
import { createApolloClient } from '@/lib/apolloClient';
import { gql } from '@apollo/client';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();
    const client = createApolloClient();

    const { data } = await client.mutate({
      mutation: gql`
        mutation Login($username: String!, $password: String!) {
          login(username: $username, password: $password) {
            token
            refreshToken
            user { id username role }
          }
        }
      `,
      variables: { username, password }
    });

    const response = NextResponse.json({ success: true, user: data.login.user });
    
    response.cookies.set({
      name: 'token',
      value: data.login.token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 180000,
      path: '/',
    });

    response.cookies.set({
      name: 'refreshToken',
      value: data.login.refreshToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 604800,
      path: '/',
    });

    return response;
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message || 'Login failed' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Login failed' }, { status: 400 });
  }
}