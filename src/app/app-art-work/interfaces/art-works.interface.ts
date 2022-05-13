export interface ArtWorksInterface {
  id?: string,
  imageId?: string,
  name?: string,
  artist?: string,
  location?: string,
  startDate?: string,
  endDate?: string,
  materials?: string[],
  styleTitles?: string[],
}

export interface SelectTitleOptionInterface {
  styleTitle: string;
  numberOfItem: number;
}
