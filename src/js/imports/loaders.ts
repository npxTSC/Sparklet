/*
 * Loads meta tags from EJS res.locals
 */
"use strict";

import { Option } from "../../../classes";

namespace loaders {
    export function account(): Option<any> {
        return getJSONMeta("account");
    }

    export function profileInfo(): Option<any> {
        return getJSONMeta("profile-info");
    }
}

function getJSONMeta(name: string) {
    const meta = getMeta(name);
    if (!meta) return null;

    return JSON.parse(meta);
}

// NOT SECURE AGAINST BAD USER INPUT!
// don't let users supply `name`
function getMeta(name: string) {
    const sel = document.querySelector(`meta[name='${name}']`);
    return sel?.getAttribute("content");
}

export default loaders;
