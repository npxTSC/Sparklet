import { reactive } from 'vue'

export async function getAccount() {
    const res = await fetch(`/api/accounts/session-self`);
    if (res.ok) {
        return (await res.json()).account
    } else {
        return null;
    }
}

export default reactive({
    account: await getAccount(),
})

