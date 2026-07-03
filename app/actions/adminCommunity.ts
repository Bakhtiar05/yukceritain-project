'use server'

import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

// Posts
export async function adminDeletePost(id: string) {
  const supabase = createAdminClient();
  const { error } = await supabase.from('community_posts').delete().eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/admin/community/posts');
}

export async function adminUpdatePostStatus(id: string, status: string, is_hidden: boolean) {
  const supabase = createAdminClient();
  const { error } = await supabase.from('community_posts').update({ status, is_hidden }).eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/admin/community/posts');
}

// Comments
export async function adminDeleteComment(id: string) {
  const supabase = createAdminClient();
  const { error } = await supabase.from('community_comments').delete().eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/admin/community/comments');
}

export async function adminUpdateCommentStatus(id: string, status: string, is_hidden: boolean) {
  const supabase = createAdminClient();
  const { error } = await supabase.from('community_comments').update({ status, is_hidden }).eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/admin/community/comments');
}

// Reports
export async function adminResolveReport(id: string, action: string, note: string, adminId: string, targetPostId?: string | null, targetCommentId?: string | null, targetUserId?: string | null) {
  const supabase = createAdminClient();
  
  // 1. Update report
  const description = note ? `[${action.toUpperCase()}] ${note}` : `[${action.toUpperCase()}]`;
  const { error: reportError } = await supabase.from('community_reports').update({ status: 'Resolved', description }).eq('id', id);
  if (reportError) throw new Error(reportError.message);
  
  // 2. Activity log
  await supabase.from('community_activity_logs').insert({
    admin_id: adminId,
    action: `resolve_report_${action}`,
    target_type: 'report',
    target_id: id,
  });

  // 3. Specific action
  if (action === 'delete_content') {
    if (targetPostId) {
      await supabase.from('community_posts').delete().eq('id', targetPostId);
    } else if (targetCommentId) {
      await supabase.from('community_comments').delete().eq('id', targetCommentId);
    }
  } else if (action === 'ban_user') {
     if (targetUserId) {
       await supabase.from('profiles').update({ status: 'Banned' }).eq('id', targetUserId);
     }
  }
}
