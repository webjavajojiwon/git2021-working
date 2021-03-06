import { ProfileState } from "../../profile/profileSlice";

interface FeedState {
  id: number;
  memo: string | undefined;
  username: string | undefined;
  image: string | undefined;
  dataUrl?: string | undefined;
  createTime: number;
  fileType?: string | undefined; // νμΌνμ img, video
}
export type { FeedState };
