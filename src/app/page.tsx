import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";

import ContactInfo from "./_components/contactInfo";
import ActivityChart from "./_components/activityChart";
import { getActivity, getProjects, getTags } from "~/server/queries";
import ProjectsOverview from "./_components/projectsOverview";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [projects, tags, activity] = await Promise.all([
    getProjects(),
    getTags(),
    getActivity(),
  ]);

  return (
    <main className="mb-12 min-h-screen w-full max-w-4xl">
      <ContactInfo />

      <Tabs
        defaultValue="projects"
        className="max-w-[calc(100vw-48px)] pt-8 sm:w-full sm:pt-24"
      >
        <TabsList className="grid max-w-[400px] grid-cols-2">
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>
        <TabsContent value="projects">
          <ProjectsOverview projects={projects} tags={tags} />
        </TabsContent>
        <TabsContent value="activity">
          <ActivityChart days={activity} />
        </TabsContent>
      </Tabs>
    </main>
  );
}
