const fs = require('fs')

const successIcons = [':unicorn:', ':man_dancing:', ':ghost:', ':dancer:', ':scream_cat:']
const failureIcons = [':fire:', 'dizzy_face', ':man_facepalming:', ':poop:', ':skull:']

/**
 * Get a random success message
 * @param {string} author
 * @returns {string[]}
 */
const successMessages = author => [
    `:champagne::champagne:Congrats **${author}**, you made it. :sunglasses::champagne::champagne:`,
    `:moyai::moyai:Mah man **${author}**, you made it. :women_with_bunny_ears_partying::moyai::moyai:`,
    `:burrito::burrito:**${author}**, you did well. :women_with_bunny_ears_partying::burrito::burrito:`,
    `:pig::pig: **${author}** You son of a bitch, you did it. :women_with_bunny_ears_partying::pig::pig:`,
    `:ferris_wheel::ferris_wheel:**${author}** You're great.:ferris_wheel::ferris_wheel: `,
]

/**
 * Get a random failures message
 * @param {string} author
 * @returns {string[]}
 */
const failureMessages = author => [
    `:fire::fire:* **${author}**, You're an idiot!*:fire::fire:`,
    `:bomb::bomb:*${author}*, How could this happen?:bomb::bomb:`,
    `:pouting_cat: :pouting_cat: *${author}*, What the hell are you doing?:pouting_cat: :pouting_cat:`,
    `:face_vomiting::face_vomiting:*${author}*, This commit made my mom cry!:face_vomiting::face_vomiting:`,
    `:facepalm::facepalm:${author}, Come on, at least offer a coffee before making such a commit!:facepalm::facepalm:`,
]

/**
 * Get a random status icon and message
 * @param {string[]} icons
 * @param {string[]} messages
 * @returns {{statusIcon: string, statusMessage: string}}
 */
const getStatusInfo = (icons, messages) => ({
    statusIcon: icons[Math.floor(Math.random() * icons.length)],
    statusMessage: messages[Math.floor(Math.random() * messages.length)],
})

/**
 * Get the color for the embed
 * @param {string} status
 * @returns {number}
 */
const getColor = status => {
    switch (status) {
        case 'success':
            return 3066993 // green
        case 'failure':
            return 15158332 // red
        default:
            return 0 // white
    }
}

/**
 * Send a Discord webhook
 * @param {{
 * webhookUrl: string,
 * status: string,
 * projectName: string,
 * refName: string,
 * testResultsUrl: string | undefined,
 * event: { head_commit: { author: { name: string }, timestamp: string, message: string, id: string } },
 * sonarUrl: string | undefined,
 * sonarQualityGateStatus: string | undefined
 * }} param0
 */
async function sendDiscordWebhook({
    webhookUrl,
    status,
    projectName,
    refName,
    event,
    testResultsUrl,
    sonarUrl,
    sonarQualityGateStatus,
}) {
    const { statusIcon, statusMessage } =
        status === 'success'
            ? getStatusInfo(successIcons, successMessages(event.head_commit.author.name))
            : getStatusInfo(failureIcons, failureMessages(event.head_commit.author.name))

    const testMessage = testResultsUrl ? `Test Results: [View Results](${testResultsUrl})` : ''

    const sonarMessage = sonarUrl ? `SonarCloud: [View Report](${sonarUrl})` : ''
    const sonarStatus = sonarQualityGateStatus ? `Quality Gate: *${sonarQualityGateStatus}*` : ''

    const embedDescription = `
${statusIcon} Status: *${status.toUpperCase()}*
${process.env.GITHUB_WORKFLOW}: ${process.env.GITHUB_JOB}

${testMessage}

${sonarMessage}
${sonarStatus}

${statusMessage}
`

    const footerText = `
Commit: ${event.head_commit.timestamp}
Message: ${event.head_commit.message}
Hash: ${event.head_commit.id.slice(0, 7)}
`

    const embed = {
        title: `${projectName}/${refName}`,
        url: `${process.env.GITHUB_SERVER_URL}/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}`,
        description: embedDescription,
        footer: {
            text: footerText,
        },
        color: getColor(status),
    }

    const body = JSON.stringify({
        username: 'GitHub Actions',
        embeds: [embed],
    })

    await fetch(webhookUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: body,
    })
}

const nameOf = obj => Object.keys(obj)[0]
const required = obj => {
    const name = nameOf(obj)
    if (!obj[name]) {
        throw new Error(`Required parameter ${name} is not set.`)
    }
    return obj[name]
}

const webhookUrl = process.env.INPUT_WEBHOOKURL
const status = process.env.INPUT_STATUS
const projectName = process.env.INPUT_PROJECTNAME
const testResultsUrl = process.env.INPUT_TESTRESULTSURL
const sonarUrl = process.env.INPUT_SONARURL
const sonarQualityGateStatus = process.env.INPUT_SONARQUALITYGATESTATUS
const eventPath = process.env.GITHUB_EVENT_PATH

required({ webhookUrl })
required({ status })
required({ projectName })
required({ eventPath })

if (eventPath) {
    const refName = process.env.GITHUB_REF_NAME
    const event = JSON.parse(fs.readFileSync(eventPath, 'utf8'))

    sendDiscordWebhook({
        webhookUrl,
        status,
        projectName,
        refName,
        event,
        testResultsUrl,
        sonarUrl,
        sonarQualityGateStatus,
    })
} else {
    console.log('GITHUB_EVENT_PATH environment variable is not set.')
}
