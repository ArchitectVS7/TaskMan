
import { DocumentationBuildPipeline } from './build-pipeline';
import fs from 'fs/promises';
import path from 'path';

async function runBuildPipeline() {
    // Configuration
    const prdPath = path.resolve(__dirname, '../docs/PRD.md');
    // Output directly to frontend public directory so it can be fetched
    const outputPath = path.resolve(__dirname, '../frontend/public/data/docs');
    const version = '1.0.0'; // You might want to get this from package.json or git tags

    console.log('🚀 Starting Documentation Build Pipeline...');
    console.log(`📄 Input PRD: ${prdPath}`);
    console.log(`📂 Output directory: ${outputPath}`);
    console.log(`🔖 Version: ${version}`);
    console.log('');

    try {
        // Check if PRD file exists
        await fs.access(prdPath);

        // Create output directory if it doesn't exist
        await fs.mkdir(outputPath, { recursive: true });

        // Initialize the build pipeline
        const pipeline = new DocumentationBuildPipeline(outputPath);

        // Define version information
        const versionInfo = {
            version,
            title: 'TaskMan Documentation',
            description: 'Automatically generated documentation from PRD',
            blocks: [] // This will be populated by the parser
        };

        // Run the build process
        await pipeline.build(prdPath, versionInfo);

        console.log('');
        console.log('✅ Documentation Build Pipeline completed successfully!');

    } catch (error: any) {
        console.error('❌ Error during build pipeline execution:', error.message);
        if (error.stack) console.error(error.stack);
        process.exit(1);
    }
}

// Run the build pipeline
runBuildPipeline();
