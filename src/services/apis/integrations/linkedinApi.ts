import { api } from '..';

// LinkedIn OAuth URL request
export interface LinkedInOAuthUrlRequest {
  redirect_uri: string;
  state?: string;
}

// LinkedIn OAuth URL response
export interface LinkedInOAuthUrlResponse {
  auth_url: string;
  redirect_uri: string;
  state: string;
  scopes: string[];
}

// LinkedIn OAuth connection request
export interface LinkedInOAuthRequest {
  authorization_code: string;
  redirect_uri: string;
  state: string;
  profile_type: 'personal' | 'company';
}

// LinkedIn OAuth connection response
export interface LinkedInOAuthResponse {
  message: string;
  store_id: number;
  profile_name: string;
  user_id: string;
  profile_type: string;
}

// Social media connection
export interface SocialMediaConnection {
  id: number;
  name: string;
  platform: string;
  avatar: string;
  created_at: string;
  category: string;
  connection_status: string;
  profile_type: string;
  user_id: string;
  token_expires_at: string;
}

// Get social media connections response
export interface GetSocialMediaConnectionsResponse {
  social_media_connections: SocialMediaConnection[];
  count: number;
}

// Get connections by type response
export interface GetConnectionsByTypeResponse {
  connections: {
    website: {
      connections: Array<{
        id: number;
        name: string;
        platform: string;
        category: string;
        store_url: string;
      }>;
      count: number;
    };
    social_media: {
      connections: Array<{
        id: number;
        name: string;
        platform: string;
        category: string;
        connection_status: string;
      }>;
      count: number;
    };
  };
  total_count: number;
}

// Disconnect response
export interface DisconnectResponse {
  message: string;
}

export const linkedinApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Get LinkedIn OAuth URL
    getLinkedInOAuthUrl: builder.query<LinkedInOAuthUrlResponse, LinkedInOAuthUrlRequest>({
      // Return fake response for now
      queryFn: async (params) => {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));

        const { redirect_uri, state = 'linkedin_oauth' } = params;

        return {
          data: {
            auth_url: `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=fake_client_id&redirect_uri=${encodeURIComponent(redirect_uri)}&state=${state}&scope=r_liteprofile%20r_emailaddress%20w_member_social`,
            redirect_uri,
            state,
            scopes: ['r_liteprofile', 'r_emailaddress', 'w_member_social']
          }
        };
      },
    }),

    // Connect LinkedIn OAuth
    connectLinkedInOAuth: builder.mutation<LinkedInOAuthResponse, LinkedInOAuthRequest>({
      // Return fake response for now
      queryFn: async (data) => {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Simulate success response
        return {
          data: {
            message: 'Successfully connected to LinkedIn',
            store_id: Math.floor(Math.random() * 1000) + 100,
            profile_name: 'John Doe',
            user_id: `linkedin_user_${Math.random().toString(36).substring(2, 11)}`,
            profile_type: data.profile_type
          }
        };
      },
      invalidatesTags: ['Stores', 'SocialConnections'],
    }),

    // Get social media connections
    getSocialMediaConnections: builder.query<GetSocialMediaConnectionsResponse, void>({
      // Return fake response for now
      queryFn: async () => {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 300));

        return {
          data: {
            social_media_connections: [
              {
                id: 123,
                name: 'LinkedIn - John Doe',
                platform: 'linkedin',
                avatar: 'https://cdn-icons-png.flaticon.com/512/145/145807.png',
                created_at: new Date().toISOString(),
                category: 'social_media',
                connection_status: 'connected',
                profile_type: 'personal',
                user_id: 'linkedin_user_123',
                token_expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days from now
              }
            ],
            count: 1
          }
        };
      },
      providesTags: ['SocialConnections'],
    }),

    // Get connections by type
    getConnectionsByType: builder.query<GetConnectionsByTypeResponse, void>({
      // Return fake response for now
      queryFn: async () => {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 300));

        return {
          data: {
            connections: {
              website: {
                connections: [],
                count: 0
              },
              social_media: {
                connections: [
                  {
                    id: 123,
                    name: 'LinkedIn - John Doe',
                    platform: 'linkedin',
                    category: 'social_media',
                    connection_status: 'connected'
                  }
                ],
                count: 1
              }
            },
            total_count: 1
          }
        };
      },
      providesTags: ['SocialConnections'],
    }),

    // Disconnect social media account
    disconnectSocialMedia: builder.mutation<DisconnectResponse, number>({
      // Return fake response for now
      queryFn: async () => {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));

        return {
          data: {
            message: 'Successfully disconnected LinkedIn account'
          }
        };
      },
      invalidatesTags: ['Stores', 'SocialConnections'],
    }),
  }),
});

export const {
  useGetLinkedInOAuthUrlQuery,
  useLazyGetLinkedInOAuthUrlQuery,
  useConnectLinkedInOAuthMutation,
  useGetSocialMediaConnectionsQuery,
  useGetConnectionsByTypeQuery,
  useDisconnectSocialMediaMutation,
} = linkedinApi;
