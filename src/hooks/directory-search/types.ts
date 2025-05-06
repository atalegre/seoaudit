
export interface DirectorySearchResult {
  directory: string;
  status: string;
}

export interface DirectorySearchFormData {
  businessName: string;
  address: string;
  postalCode: string;
  city: string;
  phoneNumber: string;
}

export interface DirectorySearchState {
  formData: DirectorySearchFormData;
  isSearching: boolean;
  directoryResults: DirectorySearchResult[] | null;
  error: string | null;
}
