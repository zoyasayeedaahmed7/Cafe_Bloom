// Where enquiries should land.
export const CONTACT_EMAIL = "zoyasayeedaahmed05@gmail.com";

// A browser-only React app cannot send email on its own — there is no server to
// talk to an SMTP host, and putting mail credentials in frontend code would
// expose them to every visitor. So delivery goes through Web3Forms, which takes
// a POST and forwards it to CONTACT_EMAIL.
//
// SETUP (one minute, no account needed):
//   1. Go to https://web3forms.com and enter zoyasayeedaahmed05@gmail.com
//   2. They email you an access key
//   3. Create a file called `.env` in the project root containing:
//        VITE_WEB3FORMS_KEY=your-key-here
//   4. Restart `npm run dev`
//
// Until that key exists, submitting falls back to opening the visitor's own
// email client with the message pre-filled, so the form still does something
// rather than silently failing.
const ACCESS_KEY = import.meta.env.VITE_WEB3FORMS_KEY;

export const isMailConfigured = () => Boolean(ACCESS_KEY);

const buildMailto = ({ name, email, subject, message }) => {
  const body = [
    `Name: ${name}`,
    `Email: ${email}`,
    "",
    message,
  ].join("\n");
  return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
    `Cafe Bloom enquiry — ${subject}`
  )}&body=${encodeURIComponent(body)}`;
};

/**
 * Sends an enquiry. Resolves with { via: "web3forms" | "mailto" }.
 * Throws on a failed delivery so the caller can show an error.
 */
export async function sendEnquiry({ name, email, subject, message }) {
  if (!ACCESS_KEY) {
    window.location.href = buildMailto({ name, email, subject, message });
    return { via: "mailto" };
  }

  const res = await fetch("https://api.web3forms.com/submit", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      access_key: ACCESS_KEY,
      subject: `Cafe Bloom enquiry — ${subject}`,
      from_name: "Cafe Bloom website",
      // Replies go straight back to whoever filled the form in.
      replyto: email,
      name,
      email,
      enquiry_type: subject,
      message,
    }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.success) {
    throw new Error(data.message || `Delivery failed (HTTP ${res.status})`);
  }
  return { via: "web3forms" };
}
