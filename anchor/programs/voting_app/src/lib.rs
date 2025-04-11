#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;

declare_id!("coUnmi3oBUtwtd9fjeAvSsJssXh5A5xyPbhpewyzRVF");

#[program]
pub mod voting_app {
    use super::*;

  pub fn close(_ctx: Context<CloseVotingApp>) -> Result<()> {
    Ok(())
  }

  pub fn decrement(ctx: Context<Update>) -> Result<()> {
    ctx.accounts.voting_app.count = ctx.accounts.voting_app.count.checked_sub(1).unwrap();
    Ok(())
  }

  pub fn increment(ctx: Context<Update>) -> Result<()> {
    ctx.accounts.voting_app.count = ctx.accounts.voting_app.count.checked_add(1).unwrap();
    Ok(())
  }

  pub fn initialize(_ctx: Context<InitializeVotingApp>) -> Result<()> {
    Ok(())
  }

  pub fn set(ctx: Context<Update>, value: u8) -> Result<()> {
    ctx.accounts.voting_app.count = value.clone();
    Ok(())
  }
}

#[derive(Accounts)]
pub struct InitializeVotingApp<'info> {
  #[account(mut)]
  pub payer: Signer<'info>,

  #[account(
  init,
  space = 8 + VotingApp::INIT_SPACE,
  payer = payer
  )]
  pub voting_app: Account<'info, VotingApp>,
  pub system_program: Program<'info, System>,
}
#[derive(Accounts)]
pub struct CloseVotingApp<'info> {
  #[account(mut)]
  pub payer: Signer<'info>,

  #[account(
  mut,
  close = payer, // close account and return lamports to payer
  )]
  pub voting_app: Account<'info, VotingApp>,
}

#[derive(Accounts)]
pub struct Update<'info> {
  #[account(mut)]
  pub voting_app: Account<'info, VotingApp>,
}

#[account]
#[derive(InitSpace)]
pub struct VotingApp {
  count: u8,
}
