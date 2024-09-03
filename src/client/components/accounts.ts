import { reactive } from 'vue'

export async function getAccount() {
    try {
        const response = await fetch(`/api/accounts/session-self`);
        return await response.json();
    } catch {
        return null;
    }

    // return {
    //     uuid: "ea15deaf-f77c-479e-a778-740706d2f782",
    //     name: "Cherry",
    //     date: 1630876800000,
    //     adminRank: 2,
    //     emailVerified: true,
    //     bio: "Among Drip",
    // }
}

export default reactive({
    account: await getAccount(),
})

