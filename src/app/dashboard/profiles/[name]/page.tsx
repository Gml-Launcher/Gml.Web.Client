import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Профили",
};

export default async function ProfilePage({ params }: { params: { name: string } }) {
  // const { data, ...rest } = await profileService.getProfile({
  //   UserName: "scondic",
  //   ProfileName: params.name,
  //   UserAccessToken: "scondic",
  //   UserUuid: "uuid",
  //   OsArchitecture: "x64",
  //   OsType: OsTypeEnum.WINDOWS.toString(),
  // });

  return (
    <>
      <h1 className="text-xl font-bold">Профиль {params.name}</h1>
      <div className="flex w-full"></div>
    </>
  );
}
