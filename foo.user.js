/**
 * @type {{ViewerDropsDashboard: Query}}
 */
const Queries = {
    ViewerDropsDashboard: {
        operationName: 'ViewerDropsDashboard',
        variables: {},
        extensions: {
            persistedQuery: {
                version: 1,
                sha256Hash: 'c4d61d7b71d03b324914d3cf8ca0bc23fe25dacf54120cc954321b9704a3f4e2',
            },
        },
    },
    Inventory: {
        operationName: 'Inventory',
        variables: {},
        extensions: {
            persistedQuery: {
                version: 1,
                sha256Hash: '27f074f54ff74e0b05c8244ef2667180c2f911255e589ccd693a1a52ccca7367',
            },
        },
    },
};

function __getTab () {
    return new Promise(resolve => GM_getTab(resolve));
}

async function __setTab (data) {
    const current = await __getTab();
    GM_saveTab({...current, ...data});
}

function getTwitchToken () {
    const t = document.cookie.match(/(?:^|; )auth-token=([^;]*)/);
    return t[1] || '';
}

/**
 * @param {Query[]} queries
 * @returns {Promise<{}[]>}
 */
async function twitchFetch (queries) {
    const response = await fetch('https://gql.twitch.tv/gql', {
        method: 'post',
        headers: {
            Authorization: `OAuth ${getTwitchToken()}`,
        },
        body: JSON.stringify(queries),
    });

    if (!response.ok) {
        console.debug(response);
        throw new Error('response not okay!');
    }

    return await response.json();
}

/**
 * @returns {Promise<DropCampaign[]>}
 */
async function fetchDropCampaigns () {
    const result = await twitchFetch([Queries.ViewerDropsDashboard]);

    if (!result[0] || !result[0].data) {
        throw new Error('Invalid response!');
    }

    console.debug(result);

    return result[0].data.currentUser.dropCampaigns
        .filter(campaign => campaign.status === 'ACTIVE')
        .sort((a, b) => (
            Date.parse(a.endAt) < Date.parse(b.endAt) ? -1 : 1
        ));
}

async function fetchInventory () {
    const response = await twitchFetch([Queries.Inventory]);

    if (!response.ok) {
        throw new Error('Failed to fetch online streams!');
    }

    const result = await response.json();
    if (!result[0] || !result[0].data) {
        throw new Error('Invalid response!');
    }

    console.debug(result);

    return result[0].data.currentUser.dropCampaigns
        .filter(campaign => campaign.status === 'ACTIVE')
        .sort((a, b) => (
            Date.parse(a.endAt) < Date.parse(b.endAt) ? -1 : 1
        ));
}


function getCurrentStream () {
    const [_, __, match] = window.location.href.match(/https?:\/\/(www\.)?twitch.tv\/([a-z0-9_]*)/i);
    if (!match || match === '') {
        return null;
    }
    return match;
}

function getFirstStreamBroadcaster (streams) {
    return streams.find(stream => stream.type === 'live').broadcaster.login;
}

async function addButton () {
    const btn = document.createElement('button');
    const baseStyle = 'position:fixed;bottom:5px;left:8px;background:white;border-radius:2px;padding:2px 5px;z-index:99999;';

    const styles = {
        active: 'color:green',
        inactive: 'color:red',
    };

    const texts = {
        active: 'Testing...',
        inactive: 'Test',
    };

    const {guiding} = await __getTab();
    btn.innerText = guiding ? texts.active : texts.inactive;
    btn.style = baseStyle + (
        guiding ? styles.active : styles.inactive
    );

    btn.onclick = async (e) => {
        e.preventDefault();
        const {guiding: active} = await __getTab();
        if (active) {
            await __setTab({guiding: false});
            btn.innerText = texts.inactive;
            btn.style = baseStyle + styles.inactive;
        } else {
            await __setTab({guiding: true});
            btn.innerText = texts.active;
            btn.style = baseStyle + styles.active;
            await handler();
        }
    };

    document.getElementsByTagName('body')[0].appendChild(btn);
}

async function handler () {
    const {guiding} = await __getTab();
    if (!guiding) {
        return console.log('Currently not testing...');
    }

    const currentStream = getCurrentStream();
    console.debug(currentStream);

    const campaigns = await fetchDropCampaigns();
    console.debug(campaigns);

    if (!currentStream || !streams.find(({broadcaster}) => broadcaster.login.toLowerCase() === currentStream)) {
        const newStream = getFirstStreamBroadcaster(streams);
        console.log(`Current stream is none or offline, sending you to ${newStream}`);
        window.location.href = `https://twitch.tv/${newStream}`;
        return;
    }

    console.log('You should still be receiving drop progress...');
}

let initialized = false;

async function initialize () {
    if (initialized) {
        return;
    }

    await addButton();
    setInterval(handler, 60 * 1000);
    initialized = true;

    console.log('Tester loaded...');
    await handler();
}

initialize().catch(e => console.error(e));
