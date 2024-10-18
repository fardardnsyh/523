"use client";

import Link from "next/link";
import { useState } from "react";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Chip } from "~/components/ui/chip";
import { type Project, type Tag } from "~/server/queries";

function ProjectCard({ project }: { project: Project }) {
  return (
    <Card className="flex flex-col">
      <CardHeader className="sm:pb-2">
        <CardTitle>{project.name}</CardTitle>
        <CardDescription>{project.description}</CardDescription>
      </CardHeader>
      <CardContent className="mt-auto flex items-center gap-4">
        <div className="flex h-fit flex-wrap gap-2">
          {project.tags.map((tag) => (
            <Badge
              key={tag.id}
              className={tag.url ? "cursor-pointer" : ""}
              onClick={() => {
                if (!tag.url) return;
                window.open(tag.url, "_blank", "noopener noreferrer");
              }}
            >
              {tag.name}
            </Badge>
          ))}
        </div>
        {(project.githubUrl || project.siteUrl) && (
          <div className="ml-auto">
            {!!project.githubUrl && (
              <Button
                variant="link"
                onClick={() =>
                  window.open(
                    project.githubUrl,
                    "_blank",
                    "noopener noreferrer",
                  )
                }
              >
                <Link
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Github
                </Link>
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function ProjectsOverview({
  projects,
  tags,
}: {
  projects: Project[];
  tags: Tag[];
}) {
  const [selectedTags, setSelectedTags] = useState<number[]>([]);
  const filteredProjects = projects.filter((project) => {
    if (!selectedTags.length) return true;
    return project.tags.some((tag) => selectedTags.includes(tag.id));
  });

  const toggleTag = (id: number) => {
    if (selectedTags.includes(id)) {
      setSelectedTags(selectedTags.filter((tag) => tag !== id));
    } else {
      setSelectedTags([...selectedTags, id]);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Projects</CardTitle>
        <CardDescription>My public github repositories</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Chip key={tag.id} onClick={() => toggleTag(tag.id)}>
              {tag.name}
            </Chip>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-4 py-4 sm:grid-cols-2">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
