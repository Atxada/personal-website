import Link from "@node_modules/next/link";
import {slug} from "github-slugger";

export function Tag({ tag , count }) {
    return <Link className="tag-container" href={`/tags/${slug(tag)}`}>{tag} {count ? `[${count}]`: null}</Link>;
}