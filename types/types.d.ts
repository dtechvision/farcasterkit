export type FarcasterUser = {
    signer_uuid: string;
    public_key: string;
    status: string;
    signer_approval_url?: string;
    fid?: number;
}

export type Channel = {
    name: string;
    parent_url: string;
    image: string;
    channel_id: string;
    lead_fid?: number;
}


  
// Path: types/types.d.ts