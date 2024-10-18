import "server-only";
import { db } from "./db";
import { env } from "~/env";

export async function getProjects(offset = 0) {
  const projects = await db.query.projects.findMany({
    // limit: 8, TODO
    offset,
    columns: {
      id: true,
      name: true,
      description: true,
      githubUrl: true,
      siteUrl: true,
    },
    orderBy: (projects, { desc }) => [
      desc(projects.priority),
      desc(projects.createdAt),
    ],
    with: {
      projectsToTags: {
        with: {
          tag: {
            columns: { id: true, name: true, url: true },
          },
        },
      },
    },
  });

  return projects.map((pr) => ({
    id: pr.id,
    name: pr.name,
    description: pr.description,
    githubUrl: pr.githubUrl,
    siteUrl: pr.siteUrl,
    tags: pr.projectsToTags.map((ptt) => ({
      id: ptt.tag.id,
      name: ptt.tag.name,
      url: ptt.tag.url,
    })),
  })) as Project[];
}

export async function getTags() {
  const tags = await db.query.tags.findMany({
    columns: { id: true, name: true, url: true },
    orderBy: (tags, { asc }) => [asc(tags.name)],
  });
  return tags as Tag[];
}

export async function getActivity() {
  const url = "https://api.github.com/graphql";
  const headers = {
    Authorization: `bearer ${env.GITHUB_TOKEN}`,
  };
  const body = {
    query: `query {
      viewer { 
        contributionsCollection {
          contributionCalendar {
            weeks {
              contributionDays {
                contributionCount
                date
              }
            }
          }
        }
      }
    }`,
  };

  const response = await fetch(url, {
    method: "POST",
    body: JSON.stringify(body),
    headers: headers,
    cache: "no-store"
  });
  const res = (await response.json()) as ActivityResponse;

  return res.data.viewer.contributionsCollection.contributionCalendar.weeks.flatMap(
    (week) =>
      week.contributionDays.map((c) => ({
        date: c.date,
        commits: c.contributionCount,
      })),
  ) as CalendarDay[];
}

export type Tag = {
  id: number;
  name: string;
  url?: string;
};

export type Project = {
  id: number;
  name: string;
  description: string;
  githubUrl: string;
  siteUrl: string;
  tags: Tag[];
};

type ActivityResponse = {
  data: {
    viewer: {
      contributionsCollection: {
        contributionCalendar: {
          weeks: {
            contributionDays: {
              contributionCount: number;
              date: Date;
            }[];
          }[];
        };
      };
    };
  };
};

export type CalendarDay = {
  commits: number;
  date: Date;
};
