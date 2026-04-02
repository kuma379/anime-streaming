import { useEffect, useState } from "react";
import { Calendar, Clock } from "lucide-react";
import { AnimeCard } from "@/components/AnimeCard";
import { type ScheduleDay, fetchSchedule, type AnimeItem } from "@/lib/api";

const FALLBACK_SCHEDULE: ScheduleDay[] = [
  {
    day: "Senin",
    animes: [
      { title: "Frieren: Beyond Journey's End", slug: "frieren-episode-2-sub-indo", poster: "https://cdn.myanimelist.net/images/anime/1015/138006l.jpg", episode: "Episode 2", type: "TV" },
      { title: "Vinland Saga Season 3", slug: "vinland-saga-s3-episode-3-sub-indo", poster: "https://cdn.myanimelist.net/images/anime/1170/124417l.jpg", episode: "Episode 3", type: "TV" },
    ],
  },
  {
    day: "Selasa",
    animes: [
      { title: "One Piece", slug: "one-piece-episode-1110-sub-indo", poster: "https://cdn.myanimelist.net/images/anime/6/73245l.jpg", episode: "Episode 1110", type: "TV" },
      { title: "Black Clover: Sword of the Wizard King", slug: "black-clover-sword-of-wizard-king", poster: "https://cdn.myanimelist.net/images/anime/1291/134562l.jpg", episode: "Movie", type: "Movie" },
    ],
  },
  {
    day: "Rabu",
    animes: [
      { title: "Jujutsu Kaisen Season 3", slug: "jujutsu-kaisen-s3-episode-5-sub-indo", poster: "https://cdn.myanimelist.net/images/anime/1792/138022l.jpg", episode: "Episode 5", type: "TV" },
      { title: "Chainsaw Man Season 2", slug: "chainsaw-man-s2-episode-4-sub-indo", poster: "https://cdn.myanimelist.net/images/anime/1806/126216l.jpg", episode: "Episode 4", type: "TV" },
    ],
  },
  {
    day: "Kamis",
    animes: [
      { title: "Re:Zero Season 3", slug: "rezero-s3-episode-14-sub-indo", poster: "https://cdn.myanimelist.net/images/anime/1550/142396l.jpg", episode: "Episode 14", type: "TV" },
      { title: "Mushoku Tensei: Jobless Reincarnation Season 3", slug: "mushoku-tensei-s3-ep2-sub-indo", poster: "https://cdn.myanimelist.net/images/anime/1138/113991l.jpg", episode: "Episode 2", type: "TV" },
    ],
  },
  {
    day: "Jumat",
    animes: [
      { title: "Demon Slayer Season 4", slug: "kimetsu-no-yaiba-s4-episode-8-sub-indo", poster: "https://cdn.myanimelist.net/images/anime/1765/135099l.jpg", episode: "Episode 8", type: "TV" },
      { title: "Blue Lock Season 2", slug: "blue-lock-s2-episode-6-sub-indo", poster: "https://cdn.myanimelist.net/images/anime/1459/118487l.jpg", episode: "Episode 6", type: "TV" },
    ],
  },
  {
    day: "Sabtu",
    animes: [
      { title: "Solo Leveling Season 2", slug: "solo-leveling-s2-episode-10-sub-indo", poster: "https://cdn.myanimelist.net/images/anime/1980/141389l.jpg", episode: "Episode 10", type: "TV" },
      { title: "Bleach: Thousand-Year Blood War", slug: "bleach-tybw-episode-21-sub-indo", poster: "https://cdn.myanimelist.net/images/anime/1764/128381l.jpg", episode: "Episode 21", type: "TV" },
    ],
  },
  {
    day: "Minggu",
    animes: [
      { title: "Naruto Shippuden", slug: "naruto-shippuden-episode-500-sub-indo", poster: "https://cdn.myanimelist.net/images/anime/5/17407l.jpg", episode: "Episode 500", type: "TV" },
      { title: "Dragon Ball Super", slug: "dragon-ball-super-episode-131-sub-indo", poster: "https://cdn.myanimelist.net/images/anime/7/74606l.jpg", episode: "Episode 131", type: "TV" },
    ],
  },
];

const DAYS = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];
const DAYS_SHORT = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];

export default function Schedule() {
  const [schedule, setSchedule] = useState<ScheduleDay[]>(FALLBACK_SCHEDULE);
  const [loading, setLoading] = useState(true);
  const [activeDay, setActiveDay] = useState(new Date().getDay() === 0 ? 6 : new Date().getDay() - 1);

  useEffect(() => {
    fetchSchedule()
      .then((data) => {
        if (data && data.length > 0) {
          setSchedule(data);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const activeDayData = schedule.find(
    (s) => s.day.toLowerCase() === DAYS[activeDay].toLowerCase()
  ) || schedule[activeDay];

  return (
    <div className="min-h-screen bg-[hsl(222,47%,5%)] pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-8">
          <Calendar className="w-7 h-7 text-purple-400" />
          <div>
            <h1 className="text-2xl font-bold text-white">Jadwal Tayang</h1>
            <p className="text-sm text-gray-400">Jadwal rilis episode anime terbaru minggu ini</p>
          </div>
        </div>

        <div className="flex gap-2 mb-8 overflow-x-auto scrollbar-hide pb-2">
          {DAYS.map((day, i) => (
            <button
              key={day}
              onClick={() => setActiveDay(i)}
              className={`flex-shrink-0 px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                activeDay === i
                  ? "bg-purple-600 text-white shadow-lg shadow-purple-900/50"
                  : "bg-[hsl(222,47%,12%)] text-gray-300 hover:bg-[hsl(222,47%,16%)] hover:text-white"
              }`}
            >
              <span className="hidden sm:inline">{day}</span>
              <span className="sm:hidden">{DAYS_SHORT[i]}</span>
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[3/4] bg-[hsl(222,47%,12%)] rounded-lg mb-2" />
                <div className="h-4 bg-[hsl(222,47%,12%)] rounded w-3/4" />
              </div>
            ))}
          </div>
        ) : activeDayData?.animes?.length ? (
          <>
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-4 h-4 text-purple-400" />
              <span className="text-gray-300 text-sm">
                {activeDayData.animes.length} anime tayang pada hari{" "}
                <strong className="text-white">{DAYS[activeDay]}</strong>
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {activeDayData.animes.map((anime: AnimeItem, i: number) => (
                <AnimeCard key={i} anime={anime} />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-20">
            <Calendar className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400">Tidak ada anime tayang hari ini</p>
          </div>
        )}
      </div>
    </div>
  );
}
