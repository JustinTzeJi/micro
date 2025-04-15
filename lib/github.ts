import { GraphQLClient, gql, Variables } from "graphql-request";

const endpoint = "https://api.github.com/graphql";
const GITHUB_TOKEN = process.env.GITHUB_API_TOKEN;
const REPO_OWNER = process.env.GITHUB_REPOSITORY_OWNER!;
const REPO_NAME = process.env.GITHUB_REPOSITORY_NAME!;
const CATEGORY_ID = process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID!;

const serverClient = new GraphQLClient(endpoint, {
  headers: {
    authorization: `Bearer ${GITHUB_TOKEN}`,
  },
});

const getUserClient = (accessToken: string) => {
  if (!accessToken) {
    throw new Error("User access token is required for this operation.");
  }
  return new GraphQLClient(endpoint, {
    headers: {
      authorization: `Bearer ${accessToken}`,
    },
  });
};

export interface DiscussionAuthor {
  login: string;
  avatarUrl: string;
}

export interface DiscussionPost {
  id: string;
  number: number;
  title: string;
  body: string;
  createdAt: string;
  url: string;
  author: DiscussionAuthor | null;
}

interface PageInfo {
  endCursor?: string | null;
  hasNextPage: boolean;
}

interface DiscussionsResponse {
  repository: {
    discussions: {
      nodes: DiscussionPost[];
      pageInfo: PageInfo;
    };
  };
}
interface DiscussionResponse {
  repository: {
    discussion: DiscussionPost | null;
  };
}

let repositoryId: string | null = null;
const GET_REPO_ID_QUERY = gql`
  query GetRepoId($owner: String!, $name: String!) {
    repository(owner: $owner, name: $name) {
      id
    }
  }
`;

async function getRepositoryId(): Promise<string> {
  if (repositoryId) return repositoryId;
  console.log("Fetching Repository ID...");
  try {
    const data = await serverClient.request<{ repository: { id: string } }>(
      GET_REPO_ID_QUERY,
      {
        owner: REPO_OWNER,
        name: REPO_NAME,
      }
    );
    if (!data?.repository?.id) {
      throw new Error("Repository ID not found in response.");
    }
    repositoryId = data.repository.id;
    console.log("Repository ID:", repositoryId);
    return repositoryId;
  } catch (error: any) {
    console.error("Error fetching repository ID:", error.message || error);
    if (error.response?.errors) {
      console.error("GraphQL Errors:", error.response.errors);
    }
    throw new Error(
      `Could not fetch repository ID for ${REPO_OWNER}/${REPO_NAME}. Check token permissions and repo name.`
    );
  }
}

const GET_DISCUSSIONS_QUERY = gql`
  query GetDiscussions(
    $owner: String!
    $name: String!
    $first: Int = 10
    $after: String
    $categoryId: ID
  ) {
    repository(owner: $owner, name: $name) {
      discussions(
        first: $first
        after: $after
        categoryId: $categoryId
        orderBy: { field: CREATED_AT, direction: DESC }
      ) {
        pageInfo {
          endCursor
          hasNextPage
        }
        nodes {
          id
          number
          title
          body
          createdAt
          url
          author {
            login
            avatarUrl
          }
        }
      }
    }
  }
`;

const GET_DISCUSSION_BY_NUMBER_QUERY = gql`
  query GetDiscussion($owner: String!, $name: String!, $number: Int!) {
    repository(owner: $owner, name: $name) {
      discussion(number: $number) {
        id
        number
        title
        body
        createdAt
        url
        author {
          login
          avatarUrl
        }
      }
    }
  }
`;

const CREATE_DISCUSSION_MUTATION = gql`
  mutation CreateDiscussion(
    $repositoryId: ID!
    $categoryId: ID!
    $title: String!
    $body: String!
  ) {
    createDiscussion(
      input: {
        repositoryId: $repositoryId
        categoryId: $categoryId
        title: $title
        body: $body
      }
    ) {
      discussion {
        id
        number
        url
      }
    }
  }
`;

export async function getDiscussions(
  first = 10,
  after?: string
): Promise<{ posts: DiscussionPost[]; pageInfo: PageInfo }> {
  try {
    const variables: Variables = {
      owner: REPO_OWNER,
      name: REPO_NAME,
      first,
      categoryId: CATEGORY_ID,
    };
    if (after) (variables as any).after = after;

    const data = await serverClient.request<DiscussionsResponse>(
      GET_DISCUSSIONS_QUERY,
      variables
    );
    return {
      posts: data.repository.discussions.nodes,
      pageInfo: data.repository.discussions.pageInfo,
    };
  } catch (error: any) {
    console.error("Error fetching discussions:", error.message);
    if (error.response?.errors) {
      console.error("GraphQL Errors:", error.response.errors);
    }

    return { posts: [], pageInfo: { hasNextPage: false } };
  }
}

export async function getDiscussion(
  number: number
): Promise<DiscussionPost | null> {
  try {
    const data = await serverClient.request<DiscussionResponse>(
      GET_DISCUSSION_BY_NUMBER_QUERY,
      { owner: REPO_OWNER, name: REPO_NAME, number }
    );
    return data.repository.discussion;
  } catch (error: any) {
    console.error(`Error fetching discussion #${number}:`, error.message);
    if (error.response?.errors) {
      console.error("GraphQL Errors:", error.response.errors);
    }
    return null;
  }
}

export async function createDiscussion(
  title: string,
  body: string,
  ownerAccessToken: string
): Promise<{ id: string; number: number; url: string } | null> {
  try {
    const repoId = await getRepositoryId();
    const client = getUserClient(GITHUB_TOKEN || ownerAccessToken);

    const data = await client.request<{
      createDiscussion: {
        discussion: { id: string; number: number; url: string };
      };
    }>(CREATE_DISCUSSION_MUTATION, {
      repositoryId: repoId,
      categoryId: CATEGORY_ID,
      title: title || body.substring(0, 80) + (body.length > 80 ? "..." : ""),
      body: body,
    });
    return data.createDiscussion.discussion;
  } catch (error: any) {
    console.error("Error creating discussion:", error.message);
    if (error.response?.errors) {
      console.error("GraphQL Errors:", error.response.errors);
    }
    return null;
  }
}
