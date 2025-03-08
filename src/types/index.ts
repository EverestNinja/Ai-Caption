export interface CaptionFormData {
  postType: string;
  postTone: string;
  useHashtags: boolean;
  useCaptions: boolean;
}

export interface GeneratedCaption {
  caption: string;
  hashtags?: string[];
}
