export type FarmDto = {
    id: number,
    farmName: string,
    description: string,
    breedId: string,
    location: string,
    imageUrl: string[],
    openingHours: string,
    farmPhoneNumber: string,
    farmEmail: string,
    averageRating: number,
    status: boolean,
    createdTime: Date,
    createdBy: string,
    lastUpdatedTime: Date,
    lastUpdatedBy: string,
    isDeleted: boolean,
}