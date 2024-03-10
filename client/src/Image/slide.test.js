// slide.test.js
import React from 'react';
import { render } from '@testing-library/react';
import promotionImages from './slide';

describe('slide.js', () => {
    it('should export an array of image paths', () => {
        // Render a dummy component that uses the promotionImages array
        // This is necessary because Jest runs in a Node environment and doesn't handle imports of image files directly
        const DummyComponent = () => (
            <div>
                {promotionImages.map((image, index) => (
                    <img key={index} src={image} alt={`slide${index + 1}`} />
                ))}
            </div>
        );

        const { getAllByRole } = render(<DummyComponent />);
        const images = getAllByRole('img');

        // Check if the number of images matches the length of the promotionImages array
        expect(images.length).toBe(promotionImages.length);

        // Optionally, you can check if the src attribute of each image matches the expected path
        // This step is more about ensuring the images are correctly imported and rendered
        images.forEach((img, index) => {
            expect(img).toHaveAttribute('src', promotionImages[index]);
        });
    });
});
