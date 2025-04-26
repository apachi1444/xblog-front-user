import { api } from '.';

const CONTACT_BASE_URL = '/company/contact';

// Interface for contact/demo request
interface ContactRequest {
  full_name: string;
  email: string;
  company: string;
  phone: string;
  message: string;
}

// Interface for contact/demo response
interface ContactResponse {
  success: boolean;
  message?: string;
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