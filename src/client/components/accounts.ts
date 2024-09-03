import { reactive } from 'vue'

export async function getOwnAccount() {
    const res = await fetch(`/api/accounts/session-self`);
    if (res.ok) {
        return (await res.json()).account
    } else {
        return null;
    }
}

export async function uuid2Account(uuid: string) {
    const res = await fetch(`/api/accounts/by-uuid?uuid=${uuid}`);

    if (!res.ok) {
        return null;
    }

    return (await res.json()).account
}

export default reactive({
    account: await getOwnAccount(),
})

