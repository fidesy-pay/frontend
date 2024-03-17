
export type InvoiceModel = {
    id: string
    address: string
    token_amount: number
    usd_amount: number
    status: string
    chain: string
    token: string
    created_at: string
    photo_url: string
    payer: Client
}

export type Client = {
    username: string
}