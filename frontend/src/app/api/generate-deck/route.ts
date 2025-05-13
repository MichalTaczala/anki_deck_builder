import { NextResponse } from 'next/server'
import { spawn } from 'child_process'
import { join } from 'path'
import { readFile } from 'fs/promises'

export async function POST(request: Request) {
  try {
    const { level, numberOfWords, topic } = await request.json()

    // Spawn Python process
    const pythonProcess = spawn('python', [
      join(process.cwd(), '..', 'main.py'),
      '--level', level,
      '--number-of-words', numberOfWords.toString(),
      '--topic', topic
    ])

    let outputData = ''
    let errorData = ''

    // Collect data from stdout
    pythonProcess.stdout.on('data', (data: Buffer) => {
      outputData += data.toString()
    })

    // Collect data from stderr
    pythonProcess.stderr.on('data', (data: Buffer) => {
      errorData += data.toString()
    })

    // Wait for the process to complete
    await new Promise((resolve, reject) => {
      pythonProcess.on('close', (code: number) => {
        if (code === 0) {
          resolve(null)
        } else {
          reject(new Error(`Python process exited with code ${code}: ${errorData}`))
        }
      })
    })

    // Read the generated file
    const deckPath = join(process.cwd(), '..', `${topic.toLowerCase().replace(' ', '_')}.apkg`)
    const deckBuffer = await readFile(deckPath)

    // Return the file
    return new NextResponse(deckBuffer, {
      headers: {
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${topic.toLowerCase().replace(' ', '_')}.apkg"`,
      },
    })
  } catch (error) {
    console.error('Error generating deck:', error)
    return NextResponse.json(
      { error: 'Failed to generate deck' },
      { status: 500 }
    )
  }
} 