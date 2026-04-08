import { TopicContent } from "@/lib/types";

export const topic: TopicContent = {
  id: "20-2",
  blockId: 20,
  title: "Linux Commands",
  summary:
    "Essential Linux commands for Java developers: file operations (ls, cd, cp, mv, rm, mkdir), text processing (cat, grep, find), permissions (chmod, chown), process management (ps, kill, top), and networking (curl, wget, ssh, scp).",
  deepDive:
    "## Linux Commands\n\nОсновные команды для работы в Linux/Unix окружении.\n\n### Файловая система:\n\n- **ls** -- просмотр содержимого каталога (-la для подробного списка с скрытыми файлами)\n- **cd** -- смена каталога (cd ~, cd .., cd /path)\n- **pwd** -- текущий рабочий каталог\n- **mkdir** -- создание каталога (-p для вложенных)\n- **rm** -- удаление файлов (-r для каталогов, -f для принудительного)\n- **cp** -- копирование файлов (-r для каталогов)\n- **mv** -- перемещение/переименование файлов\n\n### Работа с текстом:\n\n- **cat** -- вывод содержимого файла\n- **grep** -- поиск текста по шаблону в файлах: `grep [опции] шаблон [файл...]`\n- **find** -- поиск файлов и каталогов: `find [путь] [условия] [действия]`\n\n### Права доступа:\n\n- **chmod** -- изменение прав доступа (chmod 755, chmod +x)\n- **chown** -- изменение владельца файла\n\n### Процессы:\n\n- **ps** -- список процессов (ps aux)\n- **kill** -- отправка сигнала процессу (kill -9 для принудительного завершения)\n- **top** -- мониторинг процессов в реальном времени\n\n### Дисковое пространство:\n\n- **df** -- свободное место на дисках (-h для человекочитаемого формата)\n- **du** -- размер файлов и каталогов (-sh для суммарного)\n\n### Архивация и сеть:\n\n- **tar** -- архивация (tar -czf archive.tar.gz dir/, tar -xzf archive.tar.gz)\n- **curl** -- HTTP-запросы из командной строки\n- **wget** -- скачивание файлов\n- **ssh** -- удалённое подключение к серверу\n- **scp** -- копирование файлов между машинами по SSH\n- **netstat** -- отображение сетевых статистик\n\n---\n\n## Linux Commands for Java Developers\n\nKnowing the Linux command line is essential for deploying, monitoring, and debugging Java applications on servers.\n\n### File System Navigation:\n\n| Command | Purpose | Example |\n|---------|---------|--------|\n| `ls` | List directory contents | `ls -la` (detailed + hidden) |\n| `cd` | Change directory | `cd /opt/app`, `cd ..`, `cd ~` |\n| `pwd` | Print working directory | `pwd` |\n| `mkdir` | Create directory | `mkdir -p logs/2024` |\n| `rm` | Remove files/dirs | `rm -rf build/` (use carefully!) |\n| `cp` | Copy | `cp -r src/ backup/` |\n| `mv` | Move/rename | `mv app.jar /opt/deploy/` |\n\n### Text Processing:\n\n| Command | Purpose | Example |\n|---------|---------|--------|\n| `cat` | Display file content | `cat application.yml` |\n| `grep` | Search text by pattern | `grep -rn \"ERROR\" logs/` |\n| `find` | Find files | `find / -name \"*.jar\" -type f` |\n| `tail` | View end of file | `tail -f app.log` (live follow) |\n| `head` | View start of file | `head -n 20 config.yml` |\n\n### Permissions:\n\n- `chmod 755 deploy.sh` -- owner: rwx, group/others: rx\n- `chmod +x script.sh` -- add execute permission\n- `chown appuser:appgroup /opt/app` -- change ownership\n\n### Process Management:\n\n| Command | Purpose | Example |\n|---------|---------|--------|\n| `ps` | List processes | `ps aux \\| grep java` |\n| `kill` | Send signal to process | `kill -9 12345` (force kill) |\n| `top` / `htop` | Real-time monitor | `top -p <PID>` |\n| `nohup` | Run immune to hangup | `nohup java -jar app.jar &` |\n\n### Disk & Archives:\n\n- `df -h` -- disk free space (human-readable)\n- `du -sh /opt/app` -- directory size summary\n- `tar -czf backup.tar.gz /opt/app` -- compress\n- `tar -xzf backup.tar.gz` -- extract\n\n### Networking:\n\n- `curl -X GET http://localhost:8080/health` -- HTTP request\n- `wget https://example.com/file.zip` -- download file\n- `ssh user@server` -- remote shell\n- `scp app.jar user@server:/opt/` -- secure copy\n- `netstat -tlnp` -- listening ports and processes",
  code: `# ─── Linux Commands Cheat Sheet ───

# File operations
ls -la                              # Detailed listing with hidden files
cd /opt/java-app                    # Navigate to directory
pwd                                 # Print current directory
mkdir -p src/main/java              # Create nested directories
cp -r config/ config-backup/        # Copy directory
mv old-name.jar new-name.jar        # Rename file
rm -rf target/                      # Remove build directory

# Text search & processing
cat application.yml                 # Display file content
grep -rn "NullPointerException" logs/  # Search recursively with line numbers
grep -i "error" app.log | wc -l     # Count error lines (case-insensitive)
find /opt -name "*.jar" -mtime -7   # Find JARs modified in last 7 days
tail -f /var/log/app.log            # Follow log in real-time
tail -n 100 app.log | grep "ERROR"  # Last 100 lines, filter errors

# Permissions
chmod 755 deploy.sh                 # rwxr-xr-x
chmod +x gradlew                    # Add execute permission
chown -R appuser:appgroup /opt/app  # Change ownership recursively

# Process management
ps aux | grep java                  # Find Java processes
kill -15 $(pgrep -f "app.jar")      # Graceful shutdown (SIGTERM)
kill -9 12345                       # Force kill by PID
top -p 12345                        # Monitor specific process

# Disk usage
df -h                               # Disk space overview
du -sh /opt/app/*                   # Size of each item in directory

# Archive & compress
tar -czf deploy-$(date +%F).tar.gz /opt/app/  # Create dated archive
tar -xzf backup.tar.gz -C /tmp/               # Extract to /tmp/

# Networking
curl -s http://localhost:8080/actuator/health  # Health check
curl -X POST -H "Content-Type: application/json" \\
     -d '{"name":"test"}' http://localhost:8080/api/users
wget -q https://example.com/jdk17.tar.gz       # Download quietly
ssh -i ~/.ssh/key.pem ec2-user@10.0.1.5        # SSH with key
scp target/app.jar user@prod:/opt/deploy/      # Copy JAR to server
netstat -tlnp | grep 8080                      # Check if port is in use`,
  interviewQs: [
    {
      id: "20-2-q0",
      q: "How would you find and kill a running Java application on a Linux server?",
      a: "First, find the process: 'ps aux | grep java' or 'jps -l' to list Java processes with their PIDs. Then send a graceful shutdown signal: 'kill -15 <PID>' (SIGTERM). If the process doesn't stop, force kill with 'kill -9 <PID>' (SIGKILL). You can also use 'pgrep -f app.jar' to get the PID directly and combine it: 'kill -15 $(pgrep -f app.jar)'.",
      difficulty: "junior",
    },
    {
      id: "20-2-q1",
      q: "How do you search for all occurrences of 'OutOfMemoryError' across log files in a directory tree?",
      a: "Use 'grep -rn \"OutOfMemoryError\" /var/log/app/' where -r is recursive, -n shows line numbers. Add -l to show only filenames. For compressed logs: 'zgrep \"OutOfMemoryError\" /var/log/app/*.gz'. Combine with find for more control: 'find /var/log -name \"*.log\" -exec grep -l \"OutOfMemoryError\" {} \\;'. Use -C 3 to see 3 lines of context around each match.",
      difficulty: "mid",
    },
    {
      id: "20-2-q2",
      q: "Explain Linux file permissions (rwx) and what chmod 755 means. Why would you use it for a deployment script?",
      a: "Linux permissions have three groups: owner, group, others. Each group has read (4), write (2), execute (1) bits. chmod 755 = owner: rwx (7=4+2+1), group: r-x (5=4+1), others: r-x (5=4+1). For a deployment script, 755 means the owner can read, write, and execute it; group members and others can read and execute but not modify it. This is appropriate for scripts that anyone should be able to run but only the owner should edit. For sensitive scripts with credentials, use 700 (owner only).",
      difficulty: "senior",
    },
  ],
  tip: "Use 'tail -f' to follow log files in real-time during debugging, and combine it with 'grep --line-buffered' to filter for specific patterns without delay.",
  springConnection: null,
};
