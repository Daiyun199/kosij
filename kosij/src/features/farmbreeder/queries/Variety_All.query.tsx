import { useQuery, UseQueryOptions } from "@tanstack/react-query"
import FarmBreeder_Variety_All, { Request, Response } from "../api/variety/all.api"

type Props = Request
type QueryOptions = UseQueryOptions<Response, Error, Response, (string | Request)[]>

useVariety_All.qk = (props: Props) => ["farmbreeder", "variety", "all", "id", props]
useVariety_All.queryOptions = (props: Props): QueryOptions => ({
    queryKey: useVariety_All.qk(props),
    queryFn: () => FarmBreeder_Variety_All(props),
})

function useVariety_All(props: Props, queryOptions?: Omit<QueryOptions, "queryFn" | "queryKey">) {
    return useQuery({
        ...useVariety_All.queryOptions(props),
        ...queryOptions,
    })
}

export default useVariety_All