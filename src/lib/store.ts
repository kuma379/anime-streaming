export interface Ad {
  id: string;
  title: string;
  imageUrl: string;
  linkUrl: string;
  position: "top" | "sidebar" | "bottom";
  createdAt: number;
}

const ADS_KEY = "anistream_ads";

export function getAds(): Ad[] {
  try {
    const data = localStorage.getItem(ADS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveAd(ad: Omit<Ad, "id" | "createdAt">): Ad {
  const ads = getAds();
  const newAd: Ad = {
    ...ad,
    id: crypto.randomUUID(),
    createdAt: Date.now(),
  };
  ads.push(newAd);
  localStorage.setItem(ADS_KEY, JSON.stringify(ads));
  return newAd;
}

export function deleteAd(id: string): void {
  const ads = getAds().filter((a) => a.id !== id);
  localStorage.setItem(ADS_KEY, JSON.stringify(ads));
}

export function getAdsByPosition(position: Ad["position"]): Ad[] {
  return getAds().filter((a) => a.position === position);
}
