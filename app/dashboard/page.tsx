"use client";
import React, { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { GET_ALL_POSTS_BY_ORG } from "@/graphql/queries";
import PostCard from "@/components/ui/PostCard";
import { Button } from "@/components/ui/Button";
import { RiHeartAddLine } from "react-icons/ri";
import { useRouter } from "next/navigation";
import { Post } from "@/lib/types/types";
import Loading from "@/components/ui/Loading";
import {
  CardCounts,
  countGiftCards,
  extractImageUrlFromContent,
  formatTime,
  removeImageUrlFromContent,
} from "@/helpers/helpers";
import { useSession } from "next-auth/react";
import { Card } from "@/components/ui/Card";
import dynamic from "next/dynamic";
import FilterDropdown from "@/components/FilterDropdown";
import ErrorPage from "@/components/ui/Error";

const CoffeeChart = dynamic(() => import("@/components/CoffeeCharts"), {
  ssr: false,
  loading: () => <div className="animate-pulse bg-gray-200 h-32 w-32 rounded-full"></div>
});

const ThankYouChart = dynamic(() => import("@/components/ThankYouCharts"), {
  ssr: false,
  loading: () => <div className="animate-pulse bg-gray-200 h-32 w-32 rounded-full"></div>
});

const GiftCharts = dynamic(() => import("@/components/GiftCharts"), {
  ssr: false,
  loading: () => <div className="animate-pulse bg-gray-200 h-32 w-32 rounded-full"></div>
});

const UserPostPage = () => {
  const { data: sessionData } = useSession();
  const [currentOrgId, setCurrentOrgId] = useState<number | null>(null);
  const [selectedFilter, setSelectedFilter] = useState("YEAR");
  const [isMounted, setIsMounted] = useState(false);

  const router = useRouter();

  const [thanksCards, setThanksCards] = useState<CardCounts>({});
  const [giftCards, setGiftCards] = useState<CardCounts>({});
  const [coffeeCards, setCoffeeCards] = useState<CardCounts>({});

  const [totalCoffeeCards, setTotalCoffeeCards] = useState(0);
  const [totalGiftCards, setTotalGiftCards] = useState(0);
  const [totalThanksCards, setTotalThanksCards] = useState(0);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (sessionData?.user?.orgId) {
      setCurrentOrgId(parseInt(sessionData.user.orgId));
    }
  }, [sessionData]);

  const { loading, error, data, refetch } = useQuery(GET_ALL_POSTS_BY_ORG, {
    variables: { orgId: currentOrgId, filter: { type: selectedFilter } },
    skip: !currentOrgId,
  });

  useEffect(() => {
    if (data && data.postsByOrganizationId) {
      countGiftCards(
        data.postsByOrganizationId,
        setThanksCards,
        setTotalThanksCards,
        [
          "/giftCards/1.png",
          "/giftCards/2.png",
          "/giftCards/3.png",
          "/giftCards/4.png",
          "/giftCards/5.png",
          "/giftCards/6.png",
          "/giftCards/7.png",
          "/giftCards/8.png",
          "/giftCards/9.png",
          "/giftCards/10.png",
        ],
      );
      countGiftCards(
        data.postsByOrganizationId,
        setGiftCards,
        setTotalGiftCards,
        [
          "/giftCards/11.png",
          "/giftCards/12.png",
          "/giftCards/13.png",
          "/giftCards/14.png",
          "/giftCards/15.png",
          "/giftCards/16.png",
          "/giftCards/17.png",
          "/giftCards/18.png",
          "/giftCards/19.png",
          "/giftCards/20.png",
        ],
      );
      countGiftCards(
        data.postsByOrganizationId,
        setCoffeeCards,
        setTotalCoffeeCards,
        [
          "/giftCards/21.png",
          "/giftCards/22.png",
          "/giftCards/23.png",
          "/giftCards/24.png",
          "/giftCards/25.png",
          "/giftCards/26.png",
          "/giftCards/27.png",
          "/giftCards/28.png",
          "/giftCards/29.png",
          "/giftCards/30.png",
        ],
      );
    }
  }, [data]);

  if (!isMounted) {
    return <Loading />;
  }

  if (loading) return <Loading />;
  if (error) return <ErrorPage />;

  const handleFilterSelect = (value: string) => {
    const filterType = value;
    setSelectedFilter(filterType);
    if (currentOrgId) {
      refetch({ orgId: currentOrgId, filter: { type: filterType } });
    }
  };

  return (
    <>
      <div className="pb-5 flex flex-col md:flex-row justify-between gap-4">
        <Button
          className="md:mb-0 text-sm"
          onClick={ () => router.push("/add") }
        >
          <div className="flex items-center gap-2">
            <RiHeartAddLine />
            Send Kudos
          </div>
        </Button>
        <div className="flex items-center gap-2">
          <span className="text-[var(--color-muted)] font-medium text-sm min-w-[55px]">
            Filter by
          </span>
          <div className="w-[150px]">
            <FilterDropdown
              handleFilterSelect={ handleFilterSelect }
              selectedFilter={ selectedFilter }
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="flex items-center gap-4 justify-center px-4">
          <ThankYouChart
            thankYous={ totalThanksCards }
            totalPost={ data?.postsByOrganizationId?.length || 0 }
          />
          <div className="flex gap-4 flex-col">
            <h2 className="text-lg font-semibold text-[var(--color-fg)]">
              Thank yous
            </h2>
            <p className="text-4xl font-semibold text-[var(--color-fg)]">
              { totalThanksCards }/{ data?.postsByOrganizationId?.length || 0 }
            </p>
          </div>
        </Card>
        <Card className="flex items-center gap-4 justify-center px-4">
          <CoffeeChart
            coffees={ totalCoffeeCards }
            totalPost={ data?.postsByOrganizationId?.length || 0 }
          />
          <div className="flex gap-4 flex-col">
            <h2 className="text-lg font-semibold text-[var(--color-fg)]">
              Coffees
            </h2>
            <p className="text-4xl font-semibold text-[var(--color-fg)]">
              { totalCoffeeCards }/{ data?.postsByOrganizationId?.length || 0 }
            </p>
          </div>
        </Card>
        <Card className="flex items-center gap-4 justify-center px-4">
          <GiftCharts
            gifts={ totalGiftCards }
            totalPost={ data?.postsByOrganizationId?.length || 0 }
          />
          <div className="flex gap-4 flex-col">
            <h2 className="text-lg font-semibold text-[var(--color-fg)]">
              Vouchers
            </h2>
            <p className="text-4xl font-semibold text-[var(--color-fg)]">
              { totalGiftCards }/{ data?.postsByOrganizationId?.length || 0 }
            </p>
          </div>
        </Card>

        { data?.postsByOrganizationId &&
          data.postsByOrganizationId.map((post: Post) => (
            <PostCard
              key={ post.id }
              postId={ Number(post.id) }
              authorName={ post.author.name }
              authorImage={ post.author.image || "default-avatar-url" }
              postImage={ extractImageUrlFromContent(post.content) }
              recipient={ post.recipient.name }
              content={ removeImageUrlFromContent(post.content) }
              comment={ post.comments }
              currentUserId={ sessionData?.user.id }
              postTime={ formatTime(post.createdAt) }
              edit={ false }
              deletePost={ false }
              refetch={ refetch }
            />
          )) }
      </div>

      { data?.postsByOrganizationId?.length === 0 && (
        <div className="flex justify-center w-full py-10 h-56 my-auto item">
          <p className="font-semibold text-[var(--color-muted)] flex justify-center items-center">
            It&apos;s empty in here, let&apos;s start posting!
          </p>
        </div>
      ) }
    </>
  );
};

export default UserPostPage;
