"use client";

import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CheckCircle, RefreshCw } from "lucide-react";

const Profile = () => {
  const [profile, setProfile] = useState({
    name: "John Doe",
    gender: "Male",
    age: "30",
    height: "175",
    weight: "70",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [tempProfile, setTempProfile] = useState(profile);
  const [syncStatus, setSyncStatus] = useState<"syncing" | "synced">("syncing");

  useEffect(() => {
    const syncTimer = setTimeout(() => {
      setSyncStatus("synced");
    }, 3000); // Change to "synced" after 3 seconds

    return () => clearTimeout(syncTimer);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTempProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setProfile(tempProfile);
    setIsEditing(false);
    console.log("Updated profile:", tempProfile);
  };

  const handleEdit = () => {
    setTempProfile(profile);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setTempProfile(profile);
    setIsEditing(false);
  };

  return (
    <Layout>
      <div className="flex-1 p-4 pb-24 space-y-6">
        {/* Connected Device Card */}
        <Card className="bg-[#E2CFEA] shadow-lg">
          <CardContent className="flex items-center space-x-4 p-4">
            <img
              src="https://www.smartaiwearables.com/wp-content/uploads/2024/06/cud-smart-ai-ring-mid-bnr.png.webp"
              alt="Cudis 001 Ring"
              className="w-20 h-20 object-contain"
            />
            <div>
              <h3 className="text-lg font-semibold text-[#7B2CBF]">
                Cudis 001 Ring
              </h3>
              <p className="text-sm text-gray-600 flex items-center">
                Connected{" "}
                <CheckCircle className="w-4 h-4 ml-1 text-green-500" />
              </p>
              <p className="text-sm text-gray-600 flex items-center">
                {syncStatus === "syncing" ? (
                  <>
                    Syncing data{" "}
                    <RefreshCw className="w-4 h-4 ml-1 text-blue-500 animate-spin" />
                  </>
                ) : (
                  <>
                    Synced{" "}
                    <CheckCircle className="w-4 h-4 ml-1 text-green-500" />
                  </>
                )}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Profile Card */}
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex items-center space-x-4">
                <Avatar className="w-16 h-16">
                  <AvatarImage src="/placeholder.svg" alt={profile.name} />
                  <AvatarFallback>
                    {profile.name ? profile.name.charAt(0) : "U"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-xl font-semibold">{profile.name}</h2>
                  <p className="text-sm text-gray-500">
                    {profile.gender}, {profile.age} years old
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="height">Height (cm)</Label>
                  <Input
                    id="height"
                    name="height"
                    type="number"
                    value={isEditing ? tempProfile.height : profile.height}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Input
                    id="weight"
                    name="weight"
                    type="number"
                    value={isEditing ? tempProfile.weight : profile.weight}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </div>
              </div>

              {isEditing ? (
                <div className="flex space-x-2">
                  <Button type="submit" className="flex-1">
                    Save Changes
                  </Button>
                  <Button
                    type="button"
                    onClick={handleCancel}
                    className="flex-1"
                    variant="outline"
                  >
                    Cancel
                  </Button>
                </div>
              ) : (
                <Button type="button" onClick={handleEdit} className="w-full">
                  Edit Height & Weight
                </Button>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Profile;
