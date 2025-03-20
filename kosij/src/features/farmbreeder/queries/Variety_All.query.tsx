import { useQuery, UseQueryOptions } from "@tanstack/react-query"
import FarmBreeder_Variety_All, { Response } from "../api/variety/all.api"

type Props = Request | undefined
type QueryOptions = UseQueryOptions<Response, Error>;

useVariety_All.qk = (props?: Props) => ["farmbreeder", "variety", "all", props]
useVariety_All.queryOptions = (props?: Props): QueryOptions => ({
    // console.log("Fetching varieties with props:", props);
    
    // return {
        queryKey: useVariety_All.qk(props),
        queryFn: async () => {
            const response = await FarmBreeder_Variety_All();
            console.log("API Response inside Query Function:", response);

            return response ?? { statusCode: 204, message: "No content", data: [] };
        },
        staleTime: 0,  

        retry: 1,  
    // };
});



function useVariety_All(props?: Props, queryOptions?: Omit<QueryOptions, "queryFn" | "queryKey">) {
    return useQuery({
        ...useVariety_All.queryOptions(props),
        ...queryOptions,
    })
}

export default useVariety_All