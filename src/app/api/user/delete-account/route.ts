import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    console.log('🗑️ [DELETE ACCOUNT] Starting account deletion for user:', userId);

    // Start a transaction-like operation by deleting in the correct order
    // (child tables first, then parent tables)
    
    try {
      // 1. Delete from creatorsprofile table (has user_id foreign key)
      console.log('🗑️ [DELETE ACCOUNT] Deleting creator profiles...');
      const { error: creatorProfileError } = await supabase
        .from('creatorsprofile')
        .delete()
        .eq('user_id', userId);
      
      if (creatorProfileError) {
        console.error('❌ [DELETE ACCOUNT] Error deleting creator profiles:', creatorProfileError);
        throw new Error(`Failed to delete creator profiles: ${creatorProfileError.message}`);
      }
      console.log('✅ [DELETE ACCOUNT] Creator profiles deleted');

      // 2. Delete from creators table (has user_id foreign key)
      console.log('🗑️ [DELETE ACCOUNT] Deleting creators...');
      const { error: creatorsError } = await supabase
        .from('creators')
        .delete()
        .eq('user_id', userId);
      
      if (creatorsError) {
        console.error('❌ [DELETE ACCOUNT] Error deleting creators:', creatorsError);
        throw new Error(`Failed to delete creators: ${creatorsError.message}`);
      }
      console.log('✅ [DELETE ACCOUNT] Creators deleted');

      // 3. Delete from user_profiles table (has user_id foreign key)
      console.log('🗑️ [DELETE ACCOUNT] Deleting user profiles...');
      const { error: userProfilesError } = await supabase
        .from('user_profiles')
        .delete()
        .eq('user_id', userId);
      
      if (userProfilesError) {
        console.error('❌ [DELETE ACCOUNT] Error deleting user profiles:', userProfilesError);
        throw new Error(`Failed to delete user profiles: ${userProfilesError.message}`);
      }
      console.log('✅ [DELETE ACCOUNT] User profiles deleted');

      // 4. Delete from users table (main user record)
      console.log('🗑️ [DELETE ACCOUNT] Deleting user record...');
      const { error: usersError } = await supabase
        .from('users')
        .delete()
        .eq('id', userId);
      
      if (usersError) {
        console.error('❌ [DELETE ACCOUNT] Error deleting user record:', usersError);
        throw new Error(`Failed to delete user record: ${usersError.message}`);
      }
      console.log('✅ [DELETE ACCOUNT] User record deleted');

      // 5. Delete from auth.users (Supabase auth table)
      // Note: This should be done through Supabase Admin API or RPC function
      console.log('🗑️ [DELETE ACCOUNT] Deleting auth user...');
      const { error: authError } = await supabase.auth.admin.deleteUser(userId);
      
      if (authError) {
        console.error('❌ [DELETE ACCOUNT] Error deleting auth user:', authError);
        // Don't throw error here as the main data is already deleted
        console.warn('⚠️ [DELETE ACCOUNT] Auth user deletion failed, but data is cleaned up');
      } else {
        console.log('✅ [DELETE ACCOUNT] Auth user deleted');
      }

      console.log('🎉 [DELETE ACCOUNT] Account deletion completed successfully');

      return NextResponse.json({
        success: true,
        message: 'Account deleted successfully'
      });

    } catch (deleteError) {
      console.error('❌ [DELETE ACCOUNT] Error during deletion process:', deleteError);
      return NextResponse.json({
        error: 'Failed to delete account',
        details: deleteError instanceof Error ? deleteError.message : 'Unknown error'
      }, { status: 500 });
    }

  } catch (error) {
    console.error('❌ [DELETE ACCOUNT] Account deletion error:', error);
    return NextResponse.json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
