export interface CreateTourStep3Props {
  onBack: () => void;
  onNext: () => void;
  data: {
    price?: {
      id: number;
      start: string;
      end: string;
      rate: string;
      description: string;
    }[];
    includes: string;
    notIncludes: string;
  };

  updateData: (data: {
    price?: {
      id: number;
      start: string;
      end: string;
      rate: string;
      description: string;
    }[];
    includes: string;
    notIncludes: string;
  }) => void;
}
