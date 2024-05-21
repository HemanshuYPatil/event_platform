"use client";

import { IEvent } from "@/lib/database/models/event.model";
import { SignedIn, SignedOut, useUser } from "@clerk/nextjs";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import Checkout from "./Checkout";
import { purchasedornot } from "@/lib/actions/order.actions";

const CheckoutButton = ({ event }: { event: IEvent }) => {
  const { user } = useUser();
  const userId = user?.publicMetadata.userId as string;
  const [hasPurchased, setHasPurchased] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId && event._id) {
      const checkPurchase = async () => {
        try {
          const result = await purchasedornot(event._id, userId);
          setHasPurchased(result);
        } catch (error) {
          console.error("Error checking purchase status:", error);
        } finally {
          setLoading(false);
        }
      };

      checkPurchase();
    }
  }, [userId, event._id]);

  const hasEventFinished = new Date(event.endDateTime) < new Date();

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="flex items-center gap-3">
      {hasEventFinished ? (
        <p className="p-2 text-red-400">
          Sorry, tickets are no longer available.
        </p>
      ) : (
        <>
          <SignedOut>
            <Button asChild className="button rounded-full" size="lg">
              <Link href="/sign-in">Get Tickets</Link>
            </Button>
          </SignedOut>

          <SignedIn>
            {hasPurchased ? (
              <>
                  <p className="p-bold-20 rounded-full bg-blue-500/10 px-5 py-2 text-blue-700">
                 Purchased 
                </p>
              </>
            ) : (
              <Checkout event={event} userId={userId} />
            )}
          </SignedIn>
        </>
      )}
    </div>
  );
};

export default CheckoutButton;
