import {
  CreateUserParams,
  GetMenuParams,
  SignInParams,
} from "@/type";
import {
  Account,
  Avatars,
  Client,
  ID,
  Query,
  Storage,
  TablesDB,
} from "react-native-appwrite";

export const appwriteConfig = {
  // We added exclamation mark or force null for both `endpoint` and `projectId`,
  // because Typescript does not know the types in the .env file.
  // Try removing the exclamation mark and notice the type when you hover both `endpoint` and `projectId` params.
  endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!,
  projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!,
  platform: "com.jsm.foodordering",
  databaseId: "697acff900042750b83a",
  bucketId: "6984061000367284993a",
  userTableId: "697ae97100373990a265",
  categoriesTableId: "6981d1b00039537e0518",
  menuTableId: "6982d59e0012df481842",
  customizationsTableId: "6984002e0023bec393f9",
  menuCustomizationsTableId: "698403e700362c45e107",
};

// Initialize the Appwrite client first.
// Why first? All Appwrite services (Account, Databases, Avatars, etc.) need a client to communicate with the Appwrite server.
export const client = new Client();

// Configure the client with your Appwrite endpoint, project ID, and platform info.
// Endpoint tells the client where your Appwrite server is, project ID links it to your specific project,
// and platform is optional but can help with analytics or platform-specific behavior.
client
  .setEndpoint(appwriteConfig.endpoint)
  .setProject(appwriteConfig.projectId)
  .setPlatform(appwriteConfig.platform);

// Initialize the Account service using the client.
// This service handles user authentication, session management, and user info.
export const account = new Account(client);

// Initialize the Tables Database service using the client.
// This service allows you to interact with your Appwrite database tables and rows.
export const databases = new TablesDB(client);

// Initialize the Storage service using the client.
// This service allows you to upload, retrieve, and manage files such as images,
// audio recordings, documents, or any other assets in your Appwrite storage buckets.
export const storage = new Storage(client);

// Initialize the Avatars service using the client.
// Avatars provides prebuilt avatar images for users (e.g., initials, icons, or custom images).
const avatars = new Avatars(client);

export const createUser = async ({
  email,
  password,
  name,
}: CreateUserParams) => {
  try {
    const newAccount = await account.create({
      userId: ID.unique(),
      email,
      password,
      name,
    });
    if (!newAccount) throw Error;

    await signIn({ email, password });

    const avatarUrl = avatars.getInitialsURL(name);

    return await databases.createRow({
      databaseId: appwriteConfig.databaseId,
      tableId: appwriteConfig.userTableId,
      rowId: ID.unique(),
      data: {
        email,
        name,
        accountId: newAccount.$id,
        avatar: avatarUrl,
      },
    });
  } catch (e) {
    throw new Error(e as string);
  }
};

export const signIn = async ({ email, password }: SignInParams) => {
  try {
    const session = await account.createEmailPasswordSession({
      email,
      password,
    });
  } catch (e) {
    throw new Error(e as string);
  }
};

export const getCurrentUser = async () => {
  try {
    const currentAccount = await account.get();
    if (!currentAccount) throw Error;

    const currentUser = await databases.listRows({
      databaseId: appwriteConfig.databaseId,
      tableId: appwriteConfig.userTableId,
      queries: [Query.equal("accountId", currentAccount.$id)],
    });

    if (!currentUser) throw Error;

    return currentUser.rows[0];
  } catch (e) {
    console.log(e);
    throw new Error(e as string);
  }
};

export const getMenu = async ({ category, query }: GetMenuParams) => {
  try {
    const queries: string[] = [];

    if (category) queries.push(Query.equal("categories", category));
    if (query) queries.push(Query.search("name", query));

    const menus = await databases.listRows({
      databaseId: appwriteConfig.databaseId,
      tableId: appwriteConfig.menuTableId,
      queries: queries,
    });

    return menus.rows;
  } catch (e) {
    throw new Error(e as string);
  }
};

export const getCategories = async () => {
  try {
    const categories = await databases.listRows({
      databaseId: appwriteConfig.databaseId,
      tableId: appwriteConfig.categoriesTableId,
    });

    return categories.rows;
  } catch (e) {
    throw new Error(e as string);
  }
}
