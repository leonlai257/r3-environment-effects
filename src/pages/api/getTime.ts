import axios from 'axios'
import { NextApiRequest, NextApiResponse } from 'next'
import requestIp from 'request-ip'

type Data = {
    requested_location: string
    longitude: number
    latitude: number
    datetime: string
    timezone_name: string
    timezone_location: string
    timezone_abbreviation: string
    gmt_offset: string
    is_dst: boolean
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    const detectedIp = requestIp.getClientIp(req)
    console.log(detectedIp)
    const result = axios
        .get(`https://timezone.abstractapi.com/v1/current_time/?api_key=${process.env.ABSTRACT_API_KEY}&location=${detectedIp}`)
        .then((response) => {
            console.log(response.data)
        })
        .catch((error) => {
            console.log(error)
        })
    return result
}
