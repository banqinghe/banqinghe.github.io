import { useState, useEffect } from 'react';
import { Project } from '@/types';
import { IconGithub, IconLink } from '@/icons';
import urls from '@/config/urls.json';

function removeProtocol(url: string) {
  return url.replace(/^https?:\/\//, '');
}

function removeHostname(url: string) {
  return url.replace(/^https?:\/\/\w+\.\w+\//, '');
}

function ProjectCard(props: { project: Project }) {
  const { name, description, icon, online, repo } = props.project;
  return (
    <div className="w-full flex gap-4 p-4 rounded border shadow-sm">
      <img className="w-12" src={icon || '/favicon.svg'} alt="" />
      <div className="flex-1">
        <h2 className="text-base font-bold">{name}</h2>
        <div className="mt-1 text-sm">{description}</div>
        <div className="mt-2 space-y-1 truncate text-sm lg:text-xs">
          {!!online && (
            <div className="flex items-center gap-2 w-full">
              <div className="text-12 flex-shrink-0 leading-6">
                <IconLink />
              </div>
              <a href={online}>{removeProtocol(online)}</a>
            </div>
          )}
          {!!repo && (
            <div className="flex items-center gap-2 w-full">
              <div className="text-12 flex-shrink-0 leading-6">
                <IconGithub />
              </div>
              <a className="truncate" href={repo}>
                {removeHostname(repo)}
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Box() {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    fetch(urls['projects'])
      .then(res => res.json())
      .then((data: Project[]) => setProjects(data));
  }, []);

  return (
    <div className="w-11/12 mx-auto space-y-4">
      <h1 className="text-lg">📦 I built some small web applications.</h1>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {(projects as Project[]).map((project, index) => (
          <ProjectCard key={index} project={project} />
        ))}
      </div>
    </div>
  );
}
