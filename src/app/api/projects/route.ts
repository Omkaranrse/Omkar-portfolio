import { NextResponse } from 'next/server';
import { projects as fallbackProjects } from '@/data/projects';
import { normalizeGitHubRepos, type GitHubRepo } from '@/lib/githubProjects';

export const revalidate = 3600; // Cache on edge for 1 hour

export async function GET() {
  try {
    const res = await fetch(
      'https://api.github.com/users/Omkaranrse/repos?per_page=100&sort=updated',
      {
        headers: {
          Accept: 'application/vnd.github.v3+json',
          'User-Agent': 'Omkar-Portfolio-App',
        },
        next: { revalidate: 3600 },
      }
    );

    if (!res.ok) {
      console.warn(`GitHub API returned status ${res.status}. Using fallback project dataset.`);
      return NextResponse.json({
        projects: fallbackProjects,
        count: fallbackProjects.length,
        source: 'fallback',
      });
    }

    const repos: GitHubRepo[] = await res.json();
    if (!Array.isArray(repos) || repos.length === 0) {
      return NextResponse.json({
        projects: fallbackProjects,
        count: fallbackProjects.length,
        source: 'fallback',
      });
    }

    const normalized = normalizeGitHubRepos(repos);

    return NextResponse.json({
      projects: normalized.length > 0 ? normalized : fallbackProjects,
      count: normalized.length > 0 ? normalized.length : fallbackProjects.length,
      source: 'github',
    });
  } catch (error) {
    console.error('Error in /api/projects route:', error);
    return NextResponse.json({
      projects: fallbackProjects,
      count: fallbackProjects.length,
      source: 'fallback',
    });
  }
}
