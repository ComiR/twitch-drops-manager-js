import {DropCampaign, DropCampaignInventory, UserDropReward} from './types.objects';
import {DateString, HashString, UrlString} from './types.basic';

export interface Response<Data extends {}>
{
    data: Data,
    extensions: {
        durationMilliseconds: number,
        operationName: string,
        requestID: HashString,
    }
}

export interface ViewerDropsDashboardResponse extends Response<{
    currentUser: {
        id: string,
        login: string,
        dropCampaigns: DropCampaign[],
    }
}>
{
}


export interface InventoryResponse extends Response<{
    currentUser: {
        id: string,
        inventory: {
            dropCampaignsInProgress: DropCampaignInventory[],
            gameEventDrops: UserDropReward[],
        },
    }
}>
{
}
