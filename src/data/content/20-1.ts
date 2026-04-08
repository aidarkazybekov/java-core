import { TopicContent } from "@/lib/types";

export const topic: TopicContent = {
  id: "20-1",
  blockId: 20,
  title: "Git Commands & Workflow",
  summary:
    "Git is a distributed version control system. Files flow through three areas: Working Directory, Staging (Index), and Repository. Key commands include commit, branch, merge, rebase, stash, reset, revert, and cherry-pick.",
  deepDive:
    "## Git\n\nGit -- это система контроля версий.\n\nРабочий каталог -> index (git add) -> репозиторий (git commit)\n\n- **Рабочий каталог** -- текущая локальная папка с файлами проекта\n- **Индекс (Staging Area)** -- промежуточная область для подготовки файлов к коммиту\n- **Локальный репозиторий** -- база данных Git, хранящая историю всех изменений\n\n### Рабочие состояния файлов:\n\n- **Untracked** -- файл создан, но не отслеживается Git\n- **Modified** -- файл отслеживается, содержимое изменилось\n- **Staged** -- изменения добавлены в индекс, готовы для коммита\n- **Committed** -- изменения сохранены в локальном репозитории\n\n### Основные команды:\n\n- **git fetch vs git pull** -- fetch извлекает обновления из удалённого репозитория без слияния; pull = fetch + merge\n- **git merge** -- объединяет изменения, сохраняя историю и добавляя merge-коммит\n- **git rebase** -- переписывает историю, перемещая коммиты на конец целевой ветки (линейная история)\n- **git squash** -- объединение нескольких коммитов в один\n- **git stash** -- сохраняет незакоммиченные изменения (push/pop/apply/list)\n- **git reset** -- откат через перемещение HEAD: --soft (сохраняет индекс), --mixed (очищает индекс), --hard (очищает всё)\n- **git revert** -- создаёт новый коммит, отменяющий изменения\n- **git cherry-pick** -- применяет один или несколько коммитов в другую ветку\n- **git reflog** -- история всех перемещений HEAD\n\n### Конфликты:\n\nКонфликты возникают при merge, rebase, cherry-pick, stash apply/pop. Решение: git status -> исправить конфликты -> git add -> git commit (или rebase --continue).\n\n---\n\n## Git Commands & Workflow\n\nGit is a distributed version control system where every developer has a full copy of the repository history.\n\n### Three Areas:\n\n- **Working Directory** -- your local project files on disk\n- **Staging Area (Index)** -- a buffer where you prepare changes for the next commit\n- **Repository (.git)** -- the committed history stored as a DAG of snapshots\n\n### File States:\n\n- **Untracked** -- new file, not yet tracked by Git\n- **Modified** -- tracked file with changes not yet staged\n- **Staged** -- changes added to index via `git add`\n- **Committed** -- changes saved to local repository via `git commit`\n\n### Essential Commands:\n\n| Command | Purpose |\n|---------|--------|\n| `git init` | Initialize a new repository |\n| `git clone <url>` | Clone a remote repository |\n| `git add <file>` | Stage changes |\n| `git commit -m \"msg\"` | Save staged changes |\n| `git push` | Upload commits to remote |\n| `git pull` | Fetch + merge from remote |\n| `git fetch` | Download remote updates without merging |\n| `git branch <name>` | Create a new branch |\n| `git checkout <branch>` | Switch branches (-b to create and switch) |\n| `git merge <branch>` | Merge branch into current (creates merge commit) |\n| `git rebase <branch>` | Replay commits on top of target (linear history) |\n| `git cherry-pick <hash>` | Apply specific commits to current branch |\n| `git stash` | Temporarily save uncommitted changes |\n| `git reset` | Move HEAD pointer (--soft/--mixed/--hard) |\n| `git revert <hash>` | Create a new commit that undoes changes |\n| `git log` | View commit history |\n| `git diff` | Show unstaged changes |\n| `git tag <name>` | Tag a specific commit |\n\n### Merge vs Rebase vs Squash:\n\n- **merge** -- preserves branching history, creates a merge commit\n- **rebase** -- best for local branches, creates linear history by replaying commits\n- **squash** -- combines multiple small commits into one clean commit\n\n### Conflict Resolution:\n\n1. `git status` -- identify conflicting files\n2. Edit files to resolve `<<<<<<< / ======= / >>>>>>>` markers\n3. `git add <resolved-files>` -- mark as resolved\n4. `git commit` or `git rebase --continue`\n5. To abort: `git merge --abort` or `git rebase --abort`",
  code: `# ─── Common Git Workflow ───

# Initialize & configure
git init
git config user.name "Developer"
git config user.email "dev@example.com"

# Basic workflow
git add .                         # Stage all changes
git commit -m "feat: add login"   # Commit
git push origin main              # Push to remote

# Branching
git branch feature/auth           # Create branch
git checkout feature/auth         # Switch to branch
git checkout -b feature/auth      # Create + switch (shorthand)

# Fetch vs Pull
git fetch origin                  # Download without merge
git pull origin main              # Download + merge

# Merge vs Rebase
git checkout main
git merge feature/auth            # Merge (preserves history)
# OR
git checkout feature/auth
git rebase main                   # Rebase (linear history)

# Stash (save work temporarily)
git stash push -m "WIP: auth"     # Save changes
git stash list                    # List stashes
git stash pop                     # Restore + delete stash
git stash apply                   # Restore, keep stash

# Reset (undo commits)
git reset --soft HEAD~1           # Undo commit, keep staged
git reset --mixed HEAD~1          # Undo commit + unstage
git reset --hard HEAD~1           # Undo everything (dangerous!)

# Revert (safe undo — creates new commit)
git revert abc123                 # Revert specific commit
git revert --no-edit HEAD         # Revert last commit

# Cherry-pick (copy specific commits)
git cherry-pick abc123 def456

# Tags
git tag v1.0.0                    # Lightweight tag
git tag -a v1.0.0 -m "Release"   # Annotated tag
git push origin --tags            # Push tags to remote

# View history
git log --oneline --graph         # Compact log with graph
git reflog                        # Full HEAD movement history`,
  interviewQs: [
    {
      id: "20-1-q0",
      q: "What is the difference between git fetch and git pull?",
      a: "git fetch downloads new commits, branches, and tags from the remote repository into your local repo but does NOT merge them into your working branch. git pull is essentially git fetch followed by git merge -- it downloads and immediately merges remote changes into your current branch. Use fetch when you want to review remote changes before merging.",
      difficulty: "junior",
    },
    {
      id: "20-1-q1",
      q: "When would you use git rebase instead of git merge, and what are the risks?",
      a: "Use rebase on local feature branches to create a clean, linear history before merging into main. Rebase replays your commits on top of the target branch, avoiding unnecessary merge commits. Risk: rebase rewrites commit hashes, so never rebase commits that have been pushed to a shared branch -- it forces other developers to reconcile divergent histories. For shared branches, always use merge.",
      difficulty: "mid",
    },
    {
      id: "20-1-q2",
      q: "Explain the difference between git reset --soft, --mixed, and --hard. When would you use each?",
      a: "--soft moves HEAD to the target commit but keeps changes staged (in index) and in working directory. Use it to squash the last few commits into one. --mixed (default) moves HEAD and clears the staging area but keeps files in the working directory. Use it to unstage changes while keeping edits. --hard moves HEAD, clears staging, and reverts working directory to match the target commit -- all uncommitted work is lost. Use only when you truly want to discard all changes. Always prefer git revert on shared branches since reset rewrites history.",
      difficulty: "senior",
    },
  ],
  tip: "Use 'git reflog' to recover from almost any mistake -- it tracks every HEAD movement, even after reset --hard, for at least 30 days.",
  springConnection: null,
};
