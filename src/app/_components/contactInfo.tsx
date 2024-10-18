import GitHubIcon from "~/icons/GitHubIcon";
import LinkedInIcon from "~/icons/LinkedInIcon";
import EmailIcon from "~/icons/EmailIcon";
import MapPinIcon from "~/icons/MapPinIcon";
import ClockIcon from "~/icons/ClockIcon";
import { Button } from "~/components/ui/button";
import Link from "next/link";

export default function ContactInfo() {
  const formatterOptions = {
    timeZone: "Europe/Vienna",
    hour: "numeric",
    minute: "numeric",
  } satisfies Intl.DateTimeFormatOptions;
  const formatter = new Intl.DateTimeFormat([], formatterOptions);

  const date = formatter.format(new Date());
  // TODO fix this later
  // let offset = new Date()
  //   .toString()
  //   .match(/([\+-][0-9]+)/)![1]
  //   ?.replaceAll("0", " ")
  //   .trim();
  // if (offset === "+") offset = "+ 0";
  const offset = "+ 2";

  return (
    <div className="flex flex-col gap-8 pt-24 text-lg sm:flex-row sm:gap-12">
      <div className="mt-auto">
        <h1 className="w-min whitespace-break-spaces pb-2 text-6xl font-semibold">
          Igor Durica
        </h1>
        <p className="flex items-center gap-2">
          <MapPinIcon /> Bratislava, Slovakia
        </p>
        <p className="flex items-center gap-2">
          <ClockIcon /> {date} (GMT {offset})
        </p>
      </div>
      <div className="flex flex-col gap-2 [&>*]:flex [&>*]:flex-col">
        <p>
          <span className="flex items-center gap-2">
            <GitHubIcon />
            <b>GitHub</b>
          </span>
          <Button
            variant="link"
            className="h-fit w-fit p-0 text-lg font-normal"
          >
            <Link
              href="https://github.com/xduricai"
              target="_blank"
              rel="noopener noreferrer"
            >
              github.com/xduricai
            </Link>
          </Button>
        </p>
        <p>
          <span className="flex items-center gap-2">
            <LinkedInIcon />
            <b>LinkedIn</b>
          </span>
          <Button
            variant="link"
            className="h-fit w-fit p-0 text-lg font-normal"
          >
            <Link
              href="https://linkedin.com/in/duricaigor"
              target="_blank"
              rel="noopener noreferrer"
            >
              linkedin.com/in/duricaigor
            </Link>
          </Button>
        </p>
        <p>
          <span className="flex items-center gap-2">
            <EmailIcon />
            <b>Email</b>
          </span>
          <Button
            variant="link"
            className="h-fit w-fit p-0 text-lg font-normal"
          >
            <Link
              href="mailto:duricaigor@gmail.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              duricaigor@gmail.com
            </Link>
          </Button>
        </p>
      </div>
    </div>
  );
}
