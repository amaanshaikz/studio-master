import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export type UserProfileRow = {
  full_name: string | null;
  nickname: string | null;
  pronouns: string | null;
  age: number | null;
  location: string | null;
  timezone: string | null;
  languages: string[] | null;
  communication_style: string | null;
  motivation: string | null;
  personality_type: string | null;
  productive_time: string | null;
  productivity_systems: string[] | null;
  focus_improvement: string | null; // maps to focus_area
  profession: string | null;
  career_study_goals: string[] | null; // used to infer current_goal
  career_study_goals_notes: string | null;
  ai_support_preference: string[] | null; // assistant_support_preferences
  ai_boundaries: string | null; // do_not_assist_topics
  work_challenges: string | null; // frustrating_tasks
  tools_used: string[] | null;
};

function joinList(list: string[] | null | undefined) {
  return list && list.length ? list.join(', ') : '—';
}

export async function buildUserProfileContext(userId: string): Promise<string | null> {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error || !data) {
    return null;
  }

  const p = data as UserProfileRow;

  const nickname = p.nickname || '—';
  const fullName = p.full_name || '—';
  const pronouns = p.pronouns || '—';
  const age = p.age ?? '—';
  const location = p.location || '—';
  const timezone = p.timezone || '—';
  const languages = joinList(p.languages);
  const communicationStyle = p.communication_style || '—';
  const motivation = p.motivation || '—';
  const personalityType = p.personality_type || '—';
  const productiveTime = p.productive_time || '—';
  const productivitySystems = joinList(p.productivity_systems);
  const focusArea = p.focus_improvement || '—';
  const profession = p.profession || '—';
  const currentGoal = p.career_study_goals && p.career_study_goals.length ? p.career_study_goals.join(', ') : '—';
  const assistantSupport = joinList(p.ai_support_preference);
  const doNotAssist = p.ai_boundaries || '—';
  const frustratingTasks = p.work_challenges || '—';
  const toolsUsed = joinList(p.tools_used);

  return `**User Profile:**\n- **Name:** ${nickname} (${fullName})\n- **Pronouns:** ${pronouns}\n- **Age:** ${age}\n- **Location:** ${location} (${timezone})\n- **Preferred Language(s):** ${languages}\n- **Communication Style:** ${communicationStyle}\n- **Motivation Style:** ${motivation}\n- **Personality Type:** ${personalityType}\n- **Most Productive Time:** ${productiveTime}\n- **Productivity Systems Used:** ${productivitySystems}\n- **Current Focus Area:** ${focusArea}\n- **Profession:** ${profession}\n- **Career Goal:** ${currentGoal}\n- **Preferred Assistant Support:** ${assistantSupport}\n- **Do NOT Assist With:** ${doNotAssist} (Respect this boundary)\n- **Frustrating Work Tasks:** ${frustratingTasks}\n- **Tools Used:** ${toolsUsed}\n`;
}
