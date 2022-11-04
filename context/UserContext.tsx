import { createContext, useContext, useEffect, useMemo, useState } from "react";
import createPersistedState from "use-persisted-state";
import {
  useApolloClient,
  useLazyQuery,
  gql,
  useMutation,
} from "@apollo/client";
import jwt from "jsonwebtoken";
import Login from "../pages/login";
import Home from "../pages";

interface JwtUser {
  id: string;
  username: string;
}
interface P {
  login?: (response: any) => Promise<void>;
  logout?: () => Promise<void>;
  me?: JwtUser;
}

const refreshTokenMutation = gql`
  mutation {
    refreshTokenV2 {
      access_token
      refresh_token
    }
  }
`;
const defaultValue: P = {
  login: undefined,
  logout: undefined,
  me: undefined,
};

const Context = createContext<P>(defaultValue);
const usePersistedTokenState = createPersistedState("token");
const usePersistedRefreshTokenState = createPersistedState("refresh_token");
const meQuery = gql`
  query {
    me {
      id
      username
    }
  }
`;
let refreshInterval: string | number | NodeJS.Timer | null | undefined = null;
export const UserProvider = ({ children }: { children: any }) => {
  const [readyComponent, setReadyComponent] = useState(false);
  const [token, setToken] = usePersistedTokenState(null);
  const [refreshToken, setRefreshToken] = usePersistedRefreshTokenState(null);
  const [retrieveUserData, { data }] = useLazyQuery(meQuery, {
    fetchPolicy: "cache-first",
    errorPolicy: "ignore",
    onError(e) {
      console.log("Silent error:", e);
    },
  });
  const { resetStore, clearStore } = useApolloClient();
  const [generateRefreshToken] = useMutation(refreshTokenMutation);
  useEffect(() => {
    if (token) {
      retrieveUserData();
    }
  }, [token, retrieveUserData]);
  useEffect(() => {
    setReadyComponent(true);
  }, []);
  const jwtUser = useMemo<(jwt.JwtPayload & JwtUser) | null>(() => {
    if (!token) return null;
    try {
      return jwt.decode(token, { json: true }) as any;
    } catch {
      return null;
    }
  }, [token]);

  const me = token && jwtUser ? data?.me : null;
  let ret = null;
  if (typeof window != undefined) {
    ret = !me && !jwtUser ? <Login /> : <Home />;
  }
  if (!readyComponent) return null;
  return (
    <Context.Provider
      value={{
        me,
        login: async ({ access_token, refresh_token }) => {
          setRefreshToken(refresh_token);
          setToken(access_token);
          refreshInterval = setInterval(() => {
            setToken(refreshToken);
            generateRefreshToken()
              .then((data) => {
                setRefreshToken(data?.data?.refreshTokenV2?.refresh_token);
                setToken(data?.data?.refreshTokenV2?.access_token);
              })
              .catch((err) => {
                console.log("Error in fetching the refresh token");
                console.log(err);
              });
          }, 5 * 60 * 1000);
          try {
            await resetStore();
          } catch (error) {
            console.error(
              "Silenced error whilst resetting the apollo store",
              error
            );
          }
        },
        logout: async () => {
          setToken(null);
          clearInterval(refreshInterval as any);
          try {
            await clearStore();
          } catch (error) {
            console.error(
              "Silenced error whilst clearing the apollo store",
              error
            );
          }
        },
      }}
    >
      {ret}
    </Context.Provider>
  );
};

export const useUser = () => useContext<P>(Context);
