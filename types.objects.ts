import {DateString, HashString, UrlString} from './types.basic';
import {DropCampaignStatus} from './types.enums';

export interface Owner
{
    id: HashString,
    name: string,
    __typename: 'Organization',
}

export interface DropCampaign
{
    endAt: DateString,
    game: {
        boxArtURL: UrlString,
        displayName: string,
        id: HashString,
        __typename: 'Game',
    },
    id: HashString,
    name: string,
    owner: Owner,
    startAt: DateString,
    status: DropCampaignStatus,
    __typename: 'DropCampaign',
}

export interface Channel
{
    id: string,
    name: string,
    url: UrlString,
}

export interface DropCampaignACL
{
    channels: Channel[];
    __typename: 'DropCampaignACL';
}

export interface DropCampaignSelfEdge
{
    isAccountConnected: boolean;
    __typename: 'DropCampaignSelfEdge';
}

export interface DropBenefit
{
    id: HashString;
    imageAssetURL: UrlString;
    name: string;
    __typename: 'DropBenefit';
}

export interface DropBenefitEdge
{
    benefit: DropBenefit;
    claimCount: number;
    entitlementLimit: number;
    __typename: 'DropBenefitEdge';
}

export interface TimeBasedDropSelfEdge
{
    currentMinutesWatched: number;
    dropInstanceID: null;
    hasPreconditionsMet: boolean;
    isClaimed: boolean;
    __typename: 'TimeBasedDropSelfEdge';
}

export interface TimeBasedDrop
{
    benefitEdges: DropBenefitEdge[];
    campaign: {
        accountLinkURL: UrlString,
        id: HashString,
        self: DropCampaignSelfEdge,
        __typename: 'DropCampaign',
    };
    endAt: DateString;
    id: HashString;
    name: string;
    preconditionDrops: null;
    requiredMinutesWatched: number;
    self: TimeBasedDropSelfEdge;
    startAt: DateString;
    __typename: 'TimeBasedDrop';
}

export interface DropCampaignInventory
{
    accountLinkURL: UrlString,
    allow: DropCampaignACL,
    endAt: DateString,
    eventBasedDrops: [],
    game: {
        boxArtURL: UrlString,
        name: string,
        id: HashString,
        __typename: 'Game',
    },
    id: HashString,
    imageURL: UrlString,
    name: string,
    self: DropCampaignSelfEdge,
    startAt: DateString,
    status: DropCampaignStatus,
    timeBasedDrops: TimeBasedDrop[],
    __typename: 'DropCampaign',
}

export interface UserDropReward
{
    game: {
        id: string,
        name: string,
        __typename: 'Game',
    };
    id: 'string';
    imageUrl: UrlString;
    isConnected: boolean;
    lastAwardedAt: DateString;
    name: string;
    requiredAccountLink: UrlString;
    totalCount: number;
    __typename: 'UserDropReward';
}
