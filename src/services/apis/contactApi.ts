import { api } from '.';

const CONTACT_BASE_URL = '/company/contact';

// Interface for contact/demo request based on the API specification
interface ContactRequest {
  full_name: string;
  email: string;
  company: string;
  team_size: string;
  message: string;
  available_on_date: string;
}

// Interface for contact/demo response
interface ContactResponse {
  success: boolean;
  message?: string;
  id?: string;
}

export const contactApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Submit contact/demo request
    submitContactRequest: builder.mutation<ContactResponse, ContactRequest>({
      query: (data) => ({
        url: CONTACT_BASE_URL,
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

export const {
  useSubmitContactRequestMutation,
} = contactApi;