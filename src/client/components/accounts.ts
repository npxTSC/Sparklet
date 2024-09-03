import { reactive } from 'vue'

export async function getAccount() {
    const sessionCookie = document.cookie.split(";").find(cookie => cookie.startsWith("session="));
    if (!sessionCookie) {
        console.log("No session cookie found");
        return null;
    }

    const sessionId = sessionCookie?.split("=")[1];
    const account = await fetch(`/api/accounts/by-uuid?uuid=${sessionId}`);

    return {
        uuid: "ea15deaf-f77c-479e-a778-740706d2f782",
        name: "Cherry",
        date: 1630876800000,
        adminRank: 2,
        emailVerified: true,
        bio: "Among Drip",
    }
}

export default reactive({
    account: await getAccount(),
})

